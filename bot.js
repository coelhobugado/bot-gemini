const moment = require('moment');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializa o Google Generative AI com a chave da API correta
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
                default:
                    await message.reply('Hmm... 🤔 Desculpe, humaninho, não reconheço esse comando.');
            }
        }
    });

    async function processarTexto(message, texto) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Atraso para evitar sobrecarga

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(texto);
            const response = await result.response;

            if (response.status === 'blocked' && response.reason === 'SAFETY') {
                await message.reply('Oh não, humaninho! 😢 Não posso processar essa mensagem por questões de segurança. Vamos tentar algo mais positivo? 🌟');
            } else {
                const text = await response.text();
                await message.reply(`Aqui está, humaninho: ${text} 📝`);
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

            const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;

            if (response.status === 'blocked' && response.reason === 'SAFETY') {
                await message.reply('Oh não, humaninho! 😢 Não posso processar essa imagem com esse pedido por questões de segurança. Vamos tentar algo mais positivo? 🌟');
            } else {
                const text = await response.text();
                await message.reply(`Olha o que eu encontrei, humaninho! 🌈 ${text}`);
            }
        } catch (error) {
            console.error(`Erro ao processar imagem: ${error.message}`);
            await message.reply('Ui ui, humaninho! 🙉 Houve um erro ao processar a sua imagem. Vamos tentar de novo? 🖼️');
        }
    }
}

module.exports = iniciarBot;
