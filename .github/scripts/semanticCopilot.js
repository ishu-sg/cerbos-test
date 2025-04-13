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
     
     a. A **Code Review Insights** table with the following format:
        
        | Category | Issue Description |
        | -------- | ----------------- |
        | ✅ Summary | ... |
        | 🧪 Missing Test Cases | ... |
        | 🧹 Code Smells / Style | <details><summary>Issue details</summary>\n\n\`\`\`js\n// code snippet here\n\`\`\`\n</details> |
        | 🛡 Security Risks | <details><summary>Issue details</summary>\n\n\`\`\`js\n// code snippet here\n\`\`\`\n</details> |
        | ⚠️ Potential Bugs | <details><summary>Issue details</summary>\n\n\`\`\`js\n// code snippet here\n\`\`\`\n</details> |
        | 🔁 Duplicate Logic | <details><summary>Issue details</summary>\n\n\`\`\`js\n// code snippet here\n\`\`\`\n</details> |
        | 📚 Documentation Gaps | <details><summary>Issue details</summary>\n\n\`\`\`js\n// code snippet here\n\`\`\`\n</details> |
  
     b. Format each issue cell with both the description and code snippet in a dropdown using the <details> tag as shown above. The summary should briefly state the issue, while the dropdown content contains the code snippet.
  
     c. Then, include a **Review Effort Overview** table with the following columns:
        
        | Metric | Value |
        | ------ | ----- |
        | 🧮 Effort Score (1–10) | ... |
        | 📁 Files Reviewed | ... |
        | 🧠 Areas Covered | ... |
        | 🔬 Review Depth | ... |
        | 📝 Additional Notes | ... |
  
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