import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPEN_ROUTER_KEY as string,
});

const generateQuestions = async (
  setName: string,
  numOfQuestions: 1 | 5,
  level: 'elementary' | 'high school' | 'college',
  topic: string
) => {
  const completion = await openai.chat.completions.create({
    model: 'mistralai/mistral-7b-instruct:free',
    messages: [
      {
        role: 'user',
        content: `
          Context: ${setName}.
          Generate ${numOfQuestions} test questions on ${topic} for ${level} level students. 
          Respond in JSON format and return only this:
          [{"question": "..", "answers": ".., .., .., ..", "answer": ".."}]
          Maximum 4 answers can be open or True/False do not mix them. Return answers in a single string.
        `,
      },
    ],
  });

  if (
    !completion.choices ||
    !completion.choices[0] ||
    !completion.choices[0].message ||
    !completion.choices[0].message.content
  ) {
    throw new Error('Invalid response from the API');
  }

  try {
    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error(`Error occurred: ${error}`);
  }
};

export default generateQuestions;
