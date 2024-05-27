const requestConfig = {
  codeLocation: 0, // Location.Inline
  codeLanguage: 0, // CodeLanguage.JavaScript
  source: `
      const axios = require('axios');
      async function main() {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: \`
  Your role and goal is to be an AI Smart Contract Auditor. Your job is to perform an audit on the given smart contract. Here is the smart contract: \${args[0]}.
  
  Please provide the results in the following array format for easy front-end display:
  
  [
    {
      "section": "Audit Report",
      "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
    },
    {
      "section": "Metric Scores",
      "details": [
        {
          "metric": "Security",
          "score": 0-10
        },
        {
          "metric": "Performance",
          "score": 0-10
        },
        {
          "metric": "Gas Efficiency",
          "score": 0-10
        },
        {
          "metric": "Code Quality",
          "score": 0-10
        },
        {
          "metric": "Documentation",
          "score": 0-10
        },
        {
          "metric": "Best Practices",
          "score": 0-10
        }
      ]
    },
    {
      "section": "Suggestions for Improvement",
      "details": "Suggestions for improving the smart contract in terms of security, performance, gas efficiency, code quality, documentation, and best practices."
    }
  ]
  \`
            }
          ]
        }, {
          headers: {
            'Authorization': 'Bearer \${secrets.OPENAI_API_KEY}',
            'Content-Type': 'application/json'
          }
        });
        return Functions.encodeString(JSON.stringify(response.data.choices[0].message.content));
      }
      return main();
    `,
  secrets: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  args: ["Your smart contract code here"],
  expectedReturnType: "string",
};

module.exports = requestConfig;
