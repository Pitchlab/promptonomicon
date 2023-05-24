const { Configuration, OpenAIApi } = require('openai');
const JSON5 = require('json5')

let openai;
if (process.env.OPENAI_API_KEY) {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    openai = new OpenAIApi(configuration);
} else {
    console.error('OPENAI_API_KEY not found in environment variables.');
    process.exit(1);
}

// substitute the variables in the prompt - replace {KEY} with value in variables
const substitute = (prompt, variables) => {
    let output = prompt;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{${key.toUpperCase()}}`, 'g');
        output = output.replace(regex, value);
    }
    return output;
}

// send prompt to OpenAI API
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
        let json = JSON5.parse(response_text);
        return json;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const prompt = `Create 5 titles and descriptions for {PRODUCT}. Output your result as json.`;

sendPrompt(substitute(prompt, { PRODUCT: "fishing products" }))
    .then((response) => {
        console.log(JSON.stringify(response, {space: "  "}));
    });
