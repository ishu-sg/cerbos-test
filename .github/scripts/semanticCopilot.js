const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

(async () => {
  const diff = fs.readFileSync('pr.diff', 'utf8');

  const prompt = `
  You're an expert AI code reviewer.
  
  Given the Git diff below:
  
  1. Generate a **Markdown-formatted PR comment** that includes:
     
     a. A **Code Review Insights** table with the following columns:
        - Category
        - Issue Description
        Use these categories:
          - ✅ Summary
          - 🧪 Missing Test Cases
          - 🧹 Code Smells / Style
          - 🛡 Security Risks
          - ⚠️ Potential Bugs
          - 🔁 Duplicate Logic
          - 📚 Documentation Gaps
  
     b. For each issue, immediately after the table row, include a **relevant code snippet** from the diff in a fenced block using the appropriate language (e.g., \`\`\`js or \`\`\`ts). These code snippets should illustrate the issue described.
  
     c. Then, include a **Review Effort Overview** table with the following columns:
        - 🧮 Effort Score (1–10)
        - 📁 Files Reviewed
        - 🧠 Areas Covered
        - 🔬 Review Depth
        - 📝 Additional Notes
  
  2. Format everything strictly in **Markdown**. Do not include any commentary, explanations, or prose outside the tables and code blocks.
  
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