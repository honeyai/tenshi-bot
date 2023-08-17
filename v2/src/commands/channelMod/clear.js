module.exports = {
  run: async (client, message, args) => {
    let channel = args[0] ? args : message.channel;
    console.log(channel);
    let fetched = await channel.messages.fetch();
    channel
      .bulkDelete(fetched)
      .then((message) => console.log(`Deleted ${message.size} messages`))
      .catch(console.error);
  },
  alias: ["del", "deleteAll"],
  description:
    "Clear the message in a given channel or by default the channel the command was sent in",
};
