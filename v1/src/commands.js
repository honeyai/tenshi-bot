// const PREFIX = require("../../envDoesntWork.json").PREFIX;

// //responding to actions taken in discord, ie. delete a message, sending a message, reactions
// module.exports = (client, aliases, callback) => {
//   if (typeof aliases === "string") {
//     aliases = [aliases];
//   }

//   //registering an event

//   client.on("message", async (message) => {
//     const { content } = message;

//     aliases.forEach((alias) => {
//       const command = `${PREFIX}${alias}`;

//       if (content.startsWith(`${command} `) || content === command) {
//         callback(message);
//       }
//     });

//     if (message.author.bot) return; //preventing a bot to reply to itself

//     if (
//       content === "hello" &&
//       message.channel.name === "tenshi_experimentation"
//     ) {
//       message.reply("hello there!"); // if this was "hello", it would infinitely send hello without line 9
//     }

//     if (
//       content === "what is the prefix" &&
//       message.channel.name === "tenshi_experimentation"
//     ) {
//       message.reply(`It's ${PREFIX}.`);
//     }

//     if (
//       message.author.tag === "guardian_angel#0205" &&
//       message.channel.name === "tenshi-experimentation"
//     ) {
//       let tenshiSayings = [
//         "Sorry I don't speak, pleb.",
//         "Get back to work.",
//         "Don't you have anything better to do?",
//         "This is embarrassing but ... I don't care.",
//         "Creator, you have broken my heart </3.",
//       ];
//       let randomPhrase = Math.floor(Math.random() * tenshiSayings.length);
//       message.channel.send(tenshiSayings[randomPhrase]);
//     }    

//     client.on("messageReactionAdd", (reaction, user) => {
//       //the reaction param is being field the Client object
//       // console.log("A reaction was done");
//       const { name } = reaction.emoji;
//       const member = reaction.message.guild.members.cache.get(user.id);
//       let role = reaction.message.guild.roles.cache.find(
//         (role) => role.name === "test-role"
//       );
//       if (reaction.message.id === "774115551127011338") {
//         switch (name) {
//           case "🐱":
//             member.roles.add("774114942349475850");
//             reaction.message.reply(`${member} was given the role ${role}.`);
//             break;
//           case "774379818434297858":
//             member.roles.add("774381041828757534");
//             reaction.message.reply(`${member} was given the role ${role}.`);
//             break;
//         }
//       }
//     });

//     client.on("messageReactionRemove", (reaction, user) => {
//       // console.log("shoulda remove");
//       const { name } = reaction.emoji;
//       const member = reaction.message.guild.members.cache.get(user.id);
//       let role = reaction.message.guild.roles.cache.find(
//         (role) => role.name === "test-role"
//       );
//       if (reaction.message.id === "774115551127011338") {
//         switch (name) {
//           case "🐱":
//             member.roles.remove("774114942349475850");
//             reaction.message.reply(
//               `The role, ${role}, was removed from ${member}.`
//             );
//             break;
//           case "774379818434297858" :
//             member.roles.remove("774381041828757534");
//             reaction.message.reply(
//               `The role, ${role}, was removed from ${member}.`
//             );
//             break;
//         }
//       }
//     });
//   });
// };

// const webhookClient = new WebhookClient(webhookId, webhookToken); //three params 3rd is optional => id, token, options
