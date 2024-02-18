const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const iniciarBot = require('./bot'); // Certifique-se de que este caminho está correto

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
    restartOnAuthFail: true, // Tenta reiniciar automaticamente em caso de falha de autenticação
});

client.on('qr', (qr) => {
    // Gera o QR code no terminal
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
    // Aqui o cliente do WhatsApp Web está pronto para ser usado
    iniciarBot(client); // Inicia a lógica específica do bot, passando o cliente como argumento
});

client.on('authenticated', () => {
    console.log('Autenticado com sucesso!');
});

client.on('auth_failure', (msg) => {
    // Trata falhas de autenticação
    console.error('Falha na autenticação', msg);
});

client.on('disconnected', (reason) => {
    console.log('Cliente foi desconectado!', reason);
    console.log('Tentando reconectar...');
    // Tenta reconectar após uma desconexão
    setTimeout(() => client.initialize(), 5000); // Espera 5 segundos antes de tentar reconectar
});

// Inicializa o cliente
client.initialize();
