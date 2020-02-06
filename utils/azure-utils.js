require('dotenv').config()
const sdk = require('microsoft-cognitiveservices-speech-sdk')

module.exports = async stream => {
  try {
    const audioStream = sdk.AudioInputStream.createPushStream()
    audioStream.write(stream) // TODO o stream que chega aqui é ogg e o Azure aceita apenas wav. Verificar se existe algum problema com isso.

    const audioConfig = sdk.AudioConfig.fromStreamInput(audioStream)
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_KEY, process.env.AZURE_REGION)

    speechConfig.speechRecognitionLanguage = 'pt-BR'

    const reconizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

    return reconizer.recognizeOnceAsync(
      response => {
        reconizer.close()
        return response.text
      }, error => {
        reconizer.close()
        console.trace(`err = ${error}`)
      })
  } catch (error) {
    console.trace(error)
  }
}
