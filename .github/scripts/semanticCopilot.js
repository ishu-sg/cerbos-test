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
  1. Generate a **Markdown-formatted PR comment** with two tables:
     a. **Code Review Insights** — Categorize issues as:
        - ✅ Summary
        - 🧪 Missing Test Cases
        - 🧹 Code Smells / Style
        - 🛡 Security Risks
        - ⚠️ Potential Bugs
        - 🔁 Duplicate Logic
        - 📚 Documentation Gaps
  
     b. **Review Effort Overview** — Include metrics in table form:
        - Effort Score (1–10)
        - Files Reviewed
        - Areas Covered
        - Review Depth
        - Additional Notes
  
  Only return Markdown with these two tables. No headings or text outside the format.
  
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