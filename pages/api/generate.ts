import { Configuration, OpenAIApi } from "openai";
import { isValid } from "../../helper/helpers";

import { OpenAIStream } from "helper/openAIStream";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
  runtime: "edge",
};
export default async (req: Request): Promise<Response> => {
  const body = (await req.json()) as {
    eventName: string;
    location: string;
  };
  if (!configuration.apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          message:
            "OpenAI API key not configured, please follow instructions in README.md",
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  if (!isValid(body)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Please enter acceptable values for all fields..",
        },
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const payload = {
    model: "text-davinci-003",
    prompt: generatePrompt(body),
    temperature: 0.7,
    max_tokens: 600,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

function generatePrompt(reqBody) {
  const { eventName, location } = reqBody;

  const event = eventName.trim();
  return `Write content for a monthly newsletter that is sent out to attendees of an music festival that will be held 12 months from now. The name of this event is ${event} and the location it will be held in is ${location}.
  What types of polls and surveys could we include in this newsletter?
`;
}
