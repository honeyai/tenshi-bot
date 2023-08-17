module.exports = {
  run: async (client, message, args) => { 
    //potential expansion: 
    //  - crits (20, 1)
    //  - if there's no dice given provide options
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
  alias: ['dice', 'rolldice', 'rolla'],
  description: "Roll a dice of your choosing."
};
