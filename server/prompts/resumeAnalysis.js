export const v1 = (text) => {
  return `
    Analyze the following resume plain-text content:
    ---
    ${text}
    ---
    
    Assess the resume on a scale of 0-100 and output a JSON review report detailing:
    1. Overall score
    2. Executive summary review
    3. Structural strengths (positives) and deficiencies (negatives)
    4. Key recommendations to optimize the resume for ATS parsers
    5. High-probability career target roles
  `;
};

export const activeVersion = 'v1';
export const activePrompt = v1;
