import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:
    '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',
});

const generateQuestions = async (
  setName: string,
  numOfQuestions: 1 | 5,
  level: 'elementary' | 'high school' | 'college',
  topic: string
) => {
  const completion = await openai.chat.completions.create({
    model: 'meta-llama/llama-3.1-405b-instruct:free',
    messages: [
      {
        role: 'user',
        content: `
          Imagine you are an ${setName} teacher and you want to create a test for your students. 
          Create ${numOfQuestions} question(s) about ${topic} on ${level} academic level. 
          FORMAT HAS TO BE LIKE THIS:
          Question:[question]
          Answers:[answers]
          Answer:[answer]
          "" -> if there are more questions
          Answers can be true/false or multiple choice(maximum 4). Answer is the correct answer.
          RETURN ONLY THIS FORMAT NOTHING ELSE NO ORDERING NO ADDITIONAL TEXT.
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
    console.log(completion);
    throw new Error('Invalid response from the API');
  }

  try {
    const response = completion.choices[0].message.content?.split('\n');
    if (!response) {
      return response;
    }

    const formattedResponse = [];

    for (let i = 0; i < response.length; i += 4) {
      formattedResponse.push({
        question: response[i].split('Question:')[1].trim(),
        answers: response[i + 1].split('Answers:')[1].trim(),
        answer: response[i + 2].split('Answer:')[1].trim(),
      });
    }

    return formattedResponse;
  } catch (error) {
    throw new Error(`Error occured: ${error}`);
  }
};

export default generateQuestions;
