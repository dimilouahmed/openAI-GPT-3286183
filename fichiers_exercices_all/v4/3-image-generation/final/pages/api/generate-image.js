import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export default async function (req, res) {
  if (!openai.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const input = req.body.input || "";
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }
  try {
    const response = await openai.images.generate({
      prompt: input,
      n: 1,
      size: "1024x1024",
    });

    res.status(200).json({ image_url: response.data[0].url });
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
