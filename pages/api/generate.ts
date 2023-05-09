import { isValid } from "../../helper/helpers";

import { generatePrompt } from "helper/prompt";
import { OpenAIStream, OpenAIStreamPayload } from "helper/openAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

export default async (req: Request): Promise<Response> => {
  const body = (await req.json()) as {
    eventName: string;
    location: string;
    startDate: Date;
    endDate: Date;
    hotels: string;
    artists: string;
    topic: string;
  };

  if (!isValid(body)) {
    return new Response("Please enter acceptable values for all fields..", {
      status: 400,
    });
  }
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 3200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
    messages: [
      {
        role: "user",
        content: generatePrompt(body),
      },
    ],
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};
