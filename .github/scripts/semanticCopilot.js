const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

(async () => {
  const diff = fs.readFileSync('pr.diff', 'utf8');

  const prompt = `
  You're an expert AI code reviewer specializing in security and code quality.
  
  Given the Git diff below, conduct a comprehensive code review and generate a **detailed Markdown-formatted PR comment** with:
  
  ### 1. Code Review Insights
  Create a detailed **Markdown table** with these columns:
  - **Category** (The issue type)
  - **Severity** (Critical/High/Medium/Low)
  - **Issue Description** (Detailed explanation of the problem)
  - **Code Snippet** (Exact problematic code from the diff)
  - **Recommendation** (Specific guidance to fix the issue)
  
  Analyze thoroughly across these categories:
  - ✅ **Summary**: High-level overview of all changes
  - 🧪 **Missing Test Cases**: Identify code without proper test coverage
  - 🧹 **Code Smells / Style**: Anti-patterns, complexity issues, maintainability concerns
  - 🛡 **Security Risks**: All potential vulnerabilities (OWASP Top 10, etc.)
  - ⚠️ **Potential Bugs**: Logic errors, edge cases, exception handling issues
  - 🔁 **Duplicate Logic**: Redundant code that could be refactored
  - 📚 **Documentation Gaps**: Missing or unclear documentation
  - 🔄 **Scalability Concerns**: Performance bottlenecks or scaling issues
  
  ### 2. Review Effort Overview
  Generate a detailed **Markdown table** with:
  - 🧮 **Effort Score**: Rating from 1-10 with justification
  - 📁 **Files Reviewed**: Complete list of all files covered
  - 🧠 **Areas Covered**: Technical domains reviewed (security, performance, etc.)
  - 🔬 **Review Depth**: How thoroughly each area was examined
  - 📋 **Issue Summary**: Total count of issues by severity
  - 📝 **Additional Notes**: Important context or observations
  
  ### 3. Prioritized Recommendations
  Provide a numbered list of the top 5 most important issues to address, ranked by importance, with brief explanations of why they should be prioritized.
  
  Be extremely thorough and precise. Identify ALL potential security vulnerabilities and code quality issues.
  
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