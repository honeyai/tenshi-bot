module.exports.run = async (client, message, args) => {
  const japaneseChannel = message.channel.id === '778766867032440852';
  if(!japaneseChannel) {
    try {
      await message.reply('All Japanese commands should be sent to #japanese!!')
    } catch(e) {
      console.error(e);
    }
  } else {
    message.channel.send("You are in the right channel.");
    // commands here
      // random - the hiragana
      // random - the romanji
    // random for both together
    // random for either - you guess the other thing
      // if they send hiragana - you guess the romanji
      // if they send romanji - you send hiragna
    // if you send the hiragana itself (with no request for random) - they send romanji
    // if you send the romanji itself (with no request for random) - they send hiragana
  }
}