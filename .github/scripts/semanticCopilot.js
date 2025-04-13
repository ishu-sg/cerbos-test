const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

(async () => {
  const diff = fs.readFileSync('pr.diff', 'utf8');

  const prompt = `
  You are an expert code reviewer.
  
  Analyze the following Git diff and return a Markdown table with these categories:
  
  | Category               | Issue Description                                                              |
  |------------------------|---------------------------------------------------------------------------------|
  | ✅ Summary              | High-level summary of what this pull request does                              |
  | 🧪 Missing Test Cases   | Any missing or incomplete test cases                                           |
  | 🧹 Code Smells / Style  | Any code style violations, smells or anti-patterns                             |
  | 🛡 Security Risks       | Hardcoded secrets, unsafe comparisons, risky dependencies                      |
  | ⚠️ Potential Bugs       | Logic flaws, undefined behavior, fragile conditions                            |
  | ⏱️ Performance Issues   | Performance concerns, inefficient loops or APIs                                |
  | ♻️ Refactor Suggestions | Suggestions to make code more readable or maintainable                         |
  | 📚 Documentation Gaps   | Areas that need better naming, comments, or documentation                      |
  | 🔁 Duplicate Logic      | Any repeated logic that can be abstracted                                      |
  | 🚫 Deprecated Patterns  | Usage of outdated or discouraged methods or libraries                         |
  | 🧩 Dependency Risks     | Any risky or unnecessary dependencies added                                    |
  
  Only output the table.
  
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