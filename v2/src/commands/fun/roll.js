module.exports = {
  run: async (client, message, args) => {
  let sided;
  let dice = args.find((word) => {
    if (word.startsWith("d")) {
      sided = word.substring(1);
      return word;
    }
  });
  const rollDice = () => Math.floor(Math.random() * sided) + 1;
  let roll = rollDice();
  message.reply(`Rolling a ${dice}. You rolled a ` + rollDice(), `!`);
},
  alias: ['dice', 'rolldice']
};
