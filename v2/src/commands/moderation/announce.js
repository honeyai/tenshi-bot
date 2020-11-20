module.exports = {
  run: async (client, message, args) => {
    let toSend = args.splice(1);
    let send = args.join(" ");
    console.log(args, send);
    let channel = client.channels.cache.find(
      (channel) => channel.name.toLowerCase() === send
    );
    if (channel) {
      channel.send(toSend);
    } else {
      message.channel.send(`${send} is not a valid channel.`);
    }
  },
  alias: ["say", "post", "ann", "a"],
  description: "Announce a message to another channel.",
};
