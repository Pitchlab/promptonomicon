const { Configuration, OpenAIApi } = require('openai');

let openai;

const prompt = `Create 5 titles and descriptions for fishing products. Output your result as json.`;

if (process.env.OPENAI_API_KEY) {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    openai = new OpenAIApi(configuration);
} else {
    console.error('OPENAI_API_KEY not found in environment variables.');
    process.exit(1);
}

const sendPrompt = async (prompt) => {
    console.log('Sending prompt to OpenAI API...')
    const request = {
        model: "gpt-3.5-turbo",
        temperature: 0.888,
        max_tokens: 2048,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        messages: [{ role: "user", content: prompt }],
    }

    const response = await openai.createChatCompletion(request, { timeout: 60000 });
    const response_text = response.data.choices[0].message.content.trim();
    try {
        let json = JSON.parse(response_text);
        return json;
    } catch (error) {
        console.error(error);
        return [];
    }
}

sendPrompt(prompt)
    .then((response) => {
        console.log(JSON.stringify(response));
    });