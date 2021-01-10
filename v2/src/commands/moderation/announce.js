const { MessageEmbed } = require("discord.js");
const { MessageCollector } = require("discord.js");

let messageFilter = async (message, original) =>
  message.author.id === original.author.id && !original.author.bot;

//Trying to create a embedded msg generator within discord channel.
//Some fields are objects, I need to collect the fields and set the object so I can just place a variable in

module.exports = {
  run: async (client, message, args) => {
    let nameOfChannel = args[0]; //channel
    let toChannel, title, description, color, file, image, footer;
    let emb;
    try {
      console.log("this is where it starts!!!");
      let { id } = await message.guild.channels.cache.find(
        (channel) => channel.name === nameOfChannel
      );
      toChannel = await message.guild.channels.cache.get(id);
    } catch (error) {
      console.error;
    }
    //Expansion: get the title, description, and color, files to embed if any, footer if any, via message sent
    let collector = new MessageCollector(
      message.channel,
      messageFilter.bind(null, message)
    );
    if (toChannel) {
      message.channel.send(
        `You'll be announcing in the channel, ${toChannel}. \nPlease provide the following mandatory items, in order, separated by a comma: title, description.`
      );
      collector.on("collect", (msg) => {
        if (msg.content.toLowerCase() === "done") {
          if(color && files && image && footer) {
          } else {
            color = null;
            files = null;
            image = null;
            footer = null;
            collector.stop("Embedded message was announced.");
          }
          return;
        }
        [title, description] = msg.content.split(/,\s+/);
        if (title && description) {
          message.channel.send(
            `The following are optional: color, files, image, footer. \nIf there are some of these that you don't need, send none in their place.\nIf you don't need any of these, send "done".`
          );
          [color, files, image, footer] = msg.content.split(/,\s+/);
        } else if ((!title || !description) && msg.content !== "done") {
          message.channel.send(
            "Both a title and description are necessary, please provide both. \nPlease send your message as a pair separated with a coma."
          );
        }
      });
      collector.on("end", async (collected, reason) => {
        console.log(color, files, image, footer);
        // emb = new MessageEmbed()
          // .setTitle(title)
          // .setDescription(description)
          // .setColor(color ? color : 0xff0000)
          // .attachFiles(file) //array
          // .setImage(image) //object
          // .setFooter(footer); //object
        // console.log("Done collecting", emb);
        // toChannel.send(emb);
        let emb = {
          title: "",
          description: "",
          color: color ? color : 0xff0000,
          files: "",
          image: {
            url: image,
          },
          footer: {
            text: ""
          },
        }
        toChannel.send(emb)
      });
    } else {
      message.channel.send(`${nameOfChannel} is not a valid channel.`);
    }
  },
  alias: ["say", "post", "ann", "a"],
  description: "Announce a message to another channel.",
};
