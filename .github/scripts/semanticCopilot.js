const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

(async () => {
  const diff = fs.readFileSync('pr.diff', 'utf8');

  const prompt = `
  You're an expert AI code reviewer.
  
  Given the Git diff below, generate a **Markdown-formatted PR comment** with two tables:
  
  ### 1. Code Review Insights
  For each of the following categories, provide the relevant issues in a **Markdown table** with two columns:
  - **Issue Description** (The problem identified)
  - **Code Snippet** (Example code from the diff)
  
  Categories:
  - ✅ Summary
  - 🧪 Missing Test Cases
  - 🧹 Code Smells / Style
  - 🛡 Security Risks
  - ⚠️ Potential Bugs
  - 🔁 Duplicate Logic
  - 📚 Documentation Gaps
  
  ### 2. Review Effort Overview
  Generate a **Markdown table** with the following columns:
  - 🧮 Effort Score (1–10)
  - 📁 Files Reviewed
  - 🧠 Areas Covered
  - 🔬 Review Depth
  - 📝 Additional Notes
  
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