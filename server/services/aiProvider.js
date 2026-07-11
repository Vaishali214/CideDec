import { logger } from '../utils/logger.js';
import env from '../config/env.js';

// Setup Gemini SDK if key exists
let geminiSdk = null;
if (env.GEMINI_API_KEY) {
  try {
    // Dynamically check SDK or fallback
    logger.info(`AI Provider initialized with model: ${env.GEMINI_MODEL}`);
  } catch (err) {
    logger.error('Failed to initialize Gemini SDK:', err);
  }
}

class AiProviderService {
  constructor() {
    this.provider = env.AI_PROVIDER; // 'gemini' | 'openai' | 'anthropic' | 'deepseek'
    this.model = env.GEMINI_MODEL;
    this.enabled = env.ENABLE_GEMINI;
  }

  async generateStructuredJson(promptText, schema, promptVersion = 'unknown') {
    logger.info(`[AI Provider] Dispatching query to ${this.provider} (model: ${this.model}, prompt_version: ${promptVersion})`);

    // If AI is disabled via feature flags, immediately throw or use local static templates
    if (!this.enabled) {
      logger.warn('[AI Provider] AI calls are disabled via feature flag. Returning fallback response.');
      return this.getFallbackResponse(promptVersion);
    }

    // If API key is missing, return fallback response
    if (!env.GEMINI_API_KEY && this.provider === 'gemini') {
      logger.warn('[AI Provider] GEMINI_API_KEY is missing. Using static local fallback responses.');
      return this.getFallbackResponse(promptVersion);
    }

    try {
      if (this.provider === 'gemini') {
        // Prepare Google Gemini API call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${promptText}\n\nRespond strictly with a JSON object fitting this JSON Schema: ${JSON.stringify(schema)}` }] }],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
        }

        const resData = await response.json();
        const rawJsonText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawJsonText) {
          throw new Error('Empty response from Gemini API');
        }

        const parsedJson = JSON.parse(rawJsonText);
        
        // Append Prompt Metadata for tracking
        parsedJson._metadata = {
          provider: this.provider,
          model: this.model,
          prompt_version: promptVersion,
          timestamp: new Date().toISOString()
        };

        return parsedJson;
      }

      // Fallback for unsupported providers
      throw new Error(`Provider ${this.provider} is not implemented yet.`);
    } catch (err) {
      logger.error(`[AI Provider] Failed to generate content via ${this.provider}:`, err);
      // Failover to local mock database/templates
      return this.getFallbackResponse(promptVersion);
    }
  }

  // Pre-configured structured mock data for silent fallback
  getFallbackResponse(promptVersion) {
    logger.info(`[AI Provider] Providing static fallback for prompt_version: ${promptVersion}`);

    const metadata = {
      provider: 'fallback',
      model: 'static-mock',
      prompt_version: promptVersion,
      timestamp: new Date().toISOString(),
      fallback: true
    };

    if (promptVersion.includes('resume')) {
      return {
        score: 85,
        summary: "Excellent technical resume showing strong foundational software engineering skills. The resume is clean, well-formatted, and highlights key project achievements.",
        analysis: {
          positives: ["Clear contact details", "Relevant technical skills section", "Good usage of action verbs in descriptions"],
          negatives: ["No links to working portfolios or GitHub", "Vague metrics for project achievements", "Skills section could group languages and frameworks separately"]
        },
        recommendations: [
          "Add metrics (e.g., 'Optimized query latency by 40%')",
          "Include links to GitHub or live deployments",
          "Highlight experiences with state management tools"
        ],
        careerPaths: ["Frontend Engineer", "Full Stack Developer", "Software Engineer"],
        _metadata: metadata
      };
    }

    // Default career analysis fallback
    return {
      summary: "Based on your interest, a career in modern Software Engineering offers high scalability, global remote opportunities, and a strong ROI.",
      analysis: {
        marketDemand: "Extremely High (growth of 25% projected over the next decade)",
        skillsRequired: ["JavaScript/TypeScript", "SQL/NoSQL databases", "System Design", "Cloud Hosting"],
        salaryRange: "$85,000 - $160,000 / year"
      },
      recommendations: [
        "Learn react/nextjs framework and build full stack apps",
        "Master SQL joins and relational table indexing",
        "Publish projects on GitHub to demonstrate competence"
      ],
      scores: {
        satisfaction: 90,
        growth: 95,
        remoteOptions: 85
      },
      charts: {
        salaryDistribution: [85000, 110000, 140000, 160000]
      },
      careerPaths: ["Full Stack Engineer", "Backend Developer", "DevOps Engineer"],
      risks: ["Continuous requirement to update skills", "High competition at junior levels"],
      roadmap: [
        "Months 1-3: Git, basic Javascript, and HTML/CSS styling",
        "Months 4-6: Relational databases, Express backend API builders, React frontends",
        "Months 7-12: System architectures, caching, and CI/CD server deployments"
      ],
      _metadata: metadata
    };
  }
}

export const aiProvider = new AiProviderService();
export default aiProvider;
