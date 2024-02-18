# Bot Gemini para WhatsApp

Este bot para WhatsApp é construído utilizando `whatsapp-web.js` e a API do Google Generative AI, permitindo responder a comandos de texto e processar imagens de forma avançada.

## Pré-requisitos

- Node.js [site para instalar o nodejs](https://nodejs.org/)
- Uma chave de API do Google Generative AI crie aqui: [Acesse o Google Cloud Console](https://console.cloud.google.com/)

## Instalação e Configuração

1. **Instale as Dependências:** No diretório do projeto, execute:

   ```bash
   npm install whatsapp-web.js qrcode-terminal moment @google/generative-ai


## Tutorial: Adicionando a Chave da API à Variável de Ambiente (Windows)

Siga estas etapas para adicionar a chave da API à variável de ambiente no Windows:

1. **Abrir Configurações de Variáveis de Ambiente**:
   - Pesquise no Windows "Variáveis de Ambiente" e abra o primeiro programa que aparecer.

2. **Acessar Configurações Avançadas**:
   - Ao abrir, vá para a aba "Avançado" e clique na opção "Variáveis de ambiente".

3. **Adicionar uma Nova Variável de Sistema**:
   - Em "Variáveis do Sistema", clique em "Novo".

4. **Configurar a Variável**:
   - Em "Nome da Variável", adicione o nome como `GEMINI_API_KEY` (sem aspas).
   - No campo "Valor da Variável", adicione a sua chave da API.
### O que é possível fazer com este bot?

- **Conversar com o Modelo Gemini-Pro**: Use o comando `!pi` seguido de uma mensagem para conversar com o modelo gemini-pro. Ele responderá com texto gerado com base na entrada fornecida.

- **Analisar Imagens**: Envie uma imagem com o comando `!image` seguido de uma pergunta. O bot analisará a imagem e responderá à sua pergunta com base no conteúdo da imagem.

Este bot proporciona uma experiência interativa e útil, permitindo conversas interessantes com o modelo gemini-pro e análise de conteúdo de imagens.

Para começar, siga as instruções de configuração e execute o bot. Depois, envie os comandos mencionados acima para interagir com ele no WhatsApp.
