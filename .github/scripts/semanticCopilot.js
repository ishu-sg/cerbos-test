const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

(async () => {
  const diff = fs.readFileSync('pr.diff', 'utf8');

  const prompt = `
  You're an expert AI reviewer.
  
  Your job is to:
  1. Analyze the provided Git diff.
  2. Output a Markdown-formatted PR comment containing:
  
  ### 1. A table with categorized code insights:
  | Category | Issue Description |
  
  Use these categories:
  ✅ Summary, 🧪 Missing Test Cases, 🧹 Code Smells / Style, 🛡 Security Risks, ⚠️ Potential Bugs, ♻️ Refactor Suggestions, 📚 Documentation Gaps, 🔁 Duplicate Logic
  
  ### 2. A second table evaluating review effort:
  
  | Metric | Value |
  Use:
  - Effort Score (1–10)
  - Files Reviewed
  - Areas Covered (e.g. logic, security, tests, performance)
  - Review Depth (brief description)
  - Notes (additional insights)
  
  Only return a valid Markdown comment. Keep responses crisp, informative, and structured.
  
  Git Diff:
  ${diff}
  `;
  
  

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini', 
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const output = res.choices[0].message.content.trim();
  console.log(output);
})();