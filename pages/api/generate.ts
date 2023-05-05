import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { isValid } from "../../helper/helpers";

import { generatePrompt } from "helper/prompt";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  const body = req.body;
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
  }

  if (!isValid(body)) {
    res.status(400).json({
      error: {
        message: "Please enter acceptable values for all fields..",
      },
    });
  }

  const payload = {
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 3200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: generatePrompt(body),
      },
    ],
  };

  try {
    const completion = await openai.createChatCompletion(payload);
    res.status(200).json({ result: completion.data.choices[0].message });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
};
