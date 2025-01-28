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
    model: 'deepseek/deepseek-chat',
    messages: [
      {
        role: 'user',
        content: `
          Imagine you are an ${setName} teacher and you want to create a test for your students. 
          Create ${numOfQuestions} question(s) about ${topic} on ${level} academic level. 
          FORMAT HAS TO BE LIKE THIS:
          Question:[question]
          Answers:[answers separated by comma all in one line can be true/false or multiple choice (max 4)]
          Answer:[answer correct answer]
          ALWAYS !!! RETURN THE DATA IN THIS FORMAT NO ADDITIONAL STUFF JUST THAT.
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

    console.log(response);

    const formattedResponse = [];

    for (let i = 0; i < response.length; i += 3) {
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
