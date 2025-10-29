import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

export async function askOpenAI(prompt: string, model: string = "gpt-3.5-turbo") {
  const response = await openai.createChatCompletion({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 512,
    temperature: 0.7,
  });
  return response.data.choices[0]?.message?.content || "";
}
