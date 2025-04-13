const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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'
});

(async () => {
  const diff = fs.readFileSync('pr.diff', 'utf8');

  const prompt = `
You are an experienced code reviewer.
Analyze the following Git diff and reply with:

1. A high-level summary of the changes.
2. Are there any missing test cases?
3. Are there code smells or best practices violations?
4. Any potential security risks?

--- BEGIN DIFF ---
${diff}
--- END DIFF ---
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini', 
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const output = res.choices[0].message.content.trim();
  console.log(output);
})();