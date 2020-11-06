
/*=============================================
=      Irrelevant but helpful info            =
=============================================*/

//importing env variable => loads up all the env variables
//! if os has an env with the same name it will interpret variable with os' variable of the same name

/*=====  End of Irrelevant but helpful info  ======*/



/*----------  The entry point to the bot  ----------*/
const botToken = require("../envDoesntWork.json").BOT_TOKEN;

//* == NOTE ==
//Client is a subclass of EventEmitter (extends EventEmitter) => Client extends BaseClient extends EventEmitter
// - EventEmitter from node: defined and exposed by events module
//* ===========

//to interact with the discord api
const { Client } = require("discord.js");
const client = new Client({
  partials: ['MESSAGE', 'REACTION']
});

const PREFIX = "$";



//responding to actions taken in discord, ie. delete a message, sending a message, reactions

//registering an event
client.on("ready", () => {
  console.log(`${client.user.username}, ${client.user.tag} has logged in`);
});

client.on("message", async (message) => {
  if (message.author.bot) return;                                       //preventing a bot to reply to itself

  console.log(message.author.tag, "sent a message:", message.content);
  if (
    message.content === "hello" &&
    message.channel.name === "tenshi_experimentation"
  ) {
    message.reply("hello there!");                                      // if this was "hello", it would infinitely send hello.
  }
  if (
    message.author.tag === "guardian_angel#0205" &&
    message.channel.name === "tenshi-experimentation"
  ) {
    let tenshiSayings = [
      "Sorry I don't speak, pleb.",
      "Get back to work.",
      "Don't you have anything better to do?",
      "This is embarrassing but ... I don't care.",
      "Creator, you have broken my heart </3.",
    ];
    let randomPhrase = Math.floor(Math.random() * tenshiSayings.length);
    message.channel.send(tenshiSayings[randomPhrase]);
  }

  if (message.content.startsWith(PREFIX)) {

    
    /*=============================================
    =            About array destructuring            =
    =============================================*/
        
    //array destructuring to make first element of the array is going to be put into the variable CMD_NAME then everything after will be inside the args variable which will be an arg
    // ie. $greet user => cmdname = greet and user is ['user']
    // ie. $greet u s e r => cmdname = greet and user is ['u','s','e','r']
    
    /*=====  End of About array destructuring  ======*/
    
    
    const [CMD_NAME, ...args] = message.content
      .trim()                   //Trim is for taking away the white space at the start and ends
      .substring(PREFIX.length) //sub string to get part of the start namely the string after the prefix. 
      .split(/\s+/);            //split to make an array at the white space
    if(CMD_NAME === "kick") {   //you'll need to give the bot permissions for this
      if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply("You don't have permissions to kick users.");
      if(args.length === 0) return message.reply('Please provide a user');
                                                                //cache is basically a Collection, contains the snowflakes and GuildMember
      const member = message.guild.members.cache.get(args[0]);  //get is a method for a Map because the methods a Collection has 
                                                                // wil store the GuildMember object inside of member
      if(member) {
        member.kick()
        .then(member => message.channel.send(member, "was kicked.")) // is a promise, will return GuildMember
        .catch(error => message.channel.send("I can't kick ", member));                                          
      } else {
        message.channel.send(`That member was not found`);
      }
    } else if (CMD_NAME === 'ban') { //user doesn't have to be in the server. Just has to exist. Errors  on non-existing users.
      if(!message.member.hasPermission('BAN_MEMBERS')) return message.reply("You don't have permissions to kick users.");
      if(args.length === 0) return message.reply('Please provide a user');

      try {
        const user = await message.guild.members.ban(args[0]) //gives a user resolvable => user object, snowflake(id), message, GuildMember
        message.channel.send('User was banned successfully.');
      } catch (error) {
        message.channel.send(`I couldn't do that. Either I don't have permissions or that user doesn't exists.`);
      } 
    }
  }
});


client.on('messageReactionAdd', (reaction, user) => { //the reaction param is being field the Client object
  console.log("A reaction was done");
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  let role = reaction.message.guild.roles.cache.find( role => role.name === "test-role");
  if (reaction.message.id === "774115551127011338") {
    switch (name) {
      case '🐱' : member.roles.add("774114942349475850"); reaction.message.reply(`${member} was given the role ${role}.`);
      break;
    }
  }
});

client.on('messageReactionRemove', (reaction, user) => {  //
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  console.log("shoulda remove");
  if (reaction.message.id === "774115551127011338") {
    switch (name) {
      case '🐱' : 
      member.roles.remove("774114942349475850"); 
      break;
    }
  }
});


//takes in the bot token to get the bot online
client.login(botToken);