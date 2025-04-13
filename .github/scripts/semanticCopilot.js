const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

(async () => {
  const diff = fs.readFileSync('pr.diff', 'utf8');

  const prompt = `
  You're an expert AI code reviewer.
  
  Given the Git diff below, generate a **Markdown-formatted PR comment** that includes:
  
  ---
  
  ### 1. Code Review Insights
  
  Group issues by category, using the following sections:
  - ✅ Summary
  - 🧪 Missing Test Cases
  - 🧹 Code Smells / Style
  - 🛡 Security Risks
  - ⚠️ Potential Bugs
  - 🔁 Duplicate Logic
  - 📚 Documentation Gaps
  
  For each category:
  
  - Use a **table** with the following columns:
    - Issue Description
    - Code Snippet
  
  - Render code snippets using fenced blocks (e.g. \`\`\`ts or \`\`\`js).
  - If no issues are found for a category, skip that category.
  
  ---
  
  ### 2. Review Effort Overview
  
  Render this section as a separate **Markdown table** with these columns:
  - 🧮 Effort Score (1–10)
  - 📁 Files Reviewed
  - 🧠 Areas Covered
  - 🔬 Review Depth
  - 📝 Additional Notes
  
  ---
  
  Do not include any headings or prose outside these sections. Only return well-structured Markdown output.
  
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