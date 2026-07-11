export const v1 = (query) => {
  return `
    Analyze the following career search query: "${query}"
    
    Provide a detailed career analysis detailing:
    1. Summary of the career choice.
    2. Specific market analysis (salary ranges, demand levels, required skills).
    3. Recommendations to succeed in this career path.
    4. Numeric satisfaction, growth, and remote potential scores.
    5. A 12-month step-by-step training roadmap.
    6. Potential risks or skill requirements to watch out for.
  `;
};

export const v2 = (query) => {
  return `
    Perform an enterprise-level career assessment for: "${query}"
    
    Provide comprehensive JSON statistics detailing:
    - Executive summary
    - Deep structural analysis (skills, growth trend, average salary benchmarks)
    - Actionable recommendations (specific milestones)
    - Score ratings (1-100)
    - Salary distribution data
    - High-potential career pathways
    - Identified career roadblocks/risks
    - 1-year progressive roadmap
  `;
};

export const activeVersion = 'v1';
export const activePrompt = v1;
