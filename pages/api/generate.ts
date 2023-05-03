import { Configuration, OpenAIApi } from "openai";
import { isValid } from "../../helper/helpers";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  if (!isValid(req.body)) {
    res.status(400).json({
      error: {
        message: "Please enter acceptable values for all fields..",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(req.body),
      temperature: 0.6,
      max_tokens: 600,
    });

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
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
}

function generatePrompt(reqBody) {
  const { eventName, location } = reqBody;

  const event = eventName.trim();
  return `Write content for an email blast that is sent out to attendees of an music festival that will be held 12 months from now. The name of this event is ${event} and the location it will be held in is ${location}
`;
}
