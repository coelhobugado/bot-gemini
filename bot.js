const moment = require('moment');
const { GoogleGenAI, BlockedReason, FinishReason } = require('@google/genai'); // Updated import

// Inicializa o Google Generative AI com a chave da API correta
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY); // Updated initialization

function iniciarBot(client) {
    client.on('message', async (message) => {
        console.log(`[${moment().format('HH:mm:ss')}] Mensagem recebida de ${message.from}: ${message.body}`);

        if (message.body.startsWith('!')) {
            const [comando, ...args] = message.body.slice(1).trim().split(/\s+/);
            switch (comando.toLowerCase()) {
                case 'ping':
                    const timeTaken = Date.now() - message.timestamp * 1000;
                    await message.reply(`Pong! 🏓 A latência é de ${timeTaken}ms. Como você está, humaninho? 😊`);
                    break;
                case 'pi':
                    if (args.length === 0) {
                        await message.reply('Oh, humaninho! 🌈 Por favor, adicione uma mensagem após o comando !pi. Exemplo: !pi sua mensagem aqui 💬');
                    } else {
                        const texto = args.join(' ');
                        await processarTexto(message, texto);
                    }
                    break;
                case 'image':
                    if (message.hasMedia) {
                        await processarImagemComTexto(message, args);
                    } else {
                        await message.reply('Ops! Parece que você esqueceu a imagem, humaninho! 📸 Por favor, envie uma imagem com o comando !image.');
                    }
                    break;
                case 'help':
                    const helpMessage = `Oi, humaninho! 👋 Aqui estão os comandos que eu entendo:

` +
                                        `1. *!ping* - Verifico minha latência e digo um oi! 😊
` +
                                        `2. *!pi <sua mensagem>* - Converse comigo! Eu uso o Gemini para responder. 💬
` +
                                        `   Exemplo: !pi Qual a cor do céu?
` +
                                        `3. *!image <sua pergunta>* (com uma imagem anexada) - Envie uma imagem e me pergunte algo sobre ela! 🖼️
` +
                                        `   Exemplo: !image Descreva esta paisagem.
` +
                                        `4. *!help* - Mostro esta mensagem de ajuda. 🆘`;
                    await message.reply(helpMessage);
                    break;
                default:
                    await message.reply('Hmm... 🤔 Desculpe, humaninho, não reconheço esse comando.');
            }
        }
    });

    async function processarTexto(message, texto) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Atraso para evitar sobrecarga

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Updated model name
            const result = await model.generateContent(texto);
            const response = result.response; // Updated response handling

            // Updated safety check
            if (response.promptFeedback?.blockReason === BlockedReason.SAFETY || response.candidates?.[0]?.finishReason === FinishReason.SAFETY) {
                await message.reply('Oh não, humaninho! 😢 Não posso processar essa mensagem por questões de segurança. Vamos tentar algo mais positivo? 🌟');
            } else {
                const text = response.text; // Updated text extraction
                if (text) {
                    await message.reply(`Aqui está, humaninho: ${text} 📝`);
                } else {
                    // This case handles scenarios where the response might not be blocked by safety
                    // but still doesn't contain usable text.
                    console.error("Error: response.text is undefined or empty, and not caught by safety checks. Full response:", JSON.stringify(response, null, 2));
                    await message.reply('Hmm, humaninho, não consegui gerar uma resposta desta vez. Tente reformular sua pergunta ou tente novamente mais tarde! 🤔');
                }
            }
        } catch (error) {
            console.error(`Erro ao processar texto: ${error.message}`);
            await message.reply('Nanina não, humaninho! 🙈 Isso é errado. Tente novamente mais tarde, tá? 🐾');
        }
    }

    async function processarImagemComTexto(message, args) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Atraso para evitar sobrecarga

            const media = await message.downloadMedia();
            const prompt = args.length > 0 ? args.join(' ') : "Descreva esta imagem";

            const imagePart = {
                inlineData: {
                    data: media.data,
                    mimeType: media.mimetype
                },
            };

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Updated model name
            const result = await model.generateContent({ contents: [{role: "user", parts: [prompt, imagePart]}] });
            const response = result.response; // Updated response handling

            // Updated safety check
            if (response.promptFeedback?.blockReason === BlockedReason.SAFETY || response.candidates?.[0]?.finishReason === FinishReason.SAFETY) {
                await message.reply('Oh não, humaninho! 😢 Não posso processar essa imagem com esse pedido por questões de segurança. Vamos tentar algo mais positivo? 🌟');
            } else {
                const text = response.text; // Updated text extraction
                if (text) {
                    await message.reply(`Olha o que eu encontrei, humaninho! 🌈 ${text}`);
                } else {
                    console.error("Error: response.text is undefined or empty for image processing, and not caught by safety checks. Full response:", JSON.stringify(response, null, 2));
                    await message.reply('Hmm, humaninho, não consegui processar essa imagem agora. Tente outra imagem ou tente novamente mais tarde! 🤔');
                }
            }
        } catch (error) {
            console.error(`Erro ao processar imagem: ${error.message}`);
            await message.reply('Ui ui, humaninho! 🙉 Houve um erro ao processar a sua imagem. Vamos tentar de novo? 🖼️');
        }
    }
}

module.exports = iniciarBot;
