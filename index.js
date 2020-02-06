require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const textFromAudioStream = require('./utils/azure-utils')
const bot = new TelegramBot(process.env.API_KEY, { polling: true })

bot.on('message', msg => {
  if (msg.voice) {
    const audio = msg.voice
    const stream = bot.getFileStream(audio.file_unique_id)
    textFromAudioStream(stream)
      .then(response => {
        bot.sendMessage(msg.chat.id, response)
      })
      .catch(() => {
        bot.sendMessage(msg.chat.id, 'Não consigo processar seu audio... Você deve falar pra dentro ou algo do tipo... Sugiro procurar um fonaudiólogo...')
      })
  }
})
