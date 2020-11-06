
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
const client = new Client();

const PREFIX = "$";

//takes in the bot token to get the bot online
client.login(botToken);

//responding to actions taken in discord, ie. delete a message, sending a message, reactions

//registering an event
client.on("ready", () => {
  console.log(`${client.user.username}, ${client.user.tag} has logged in`);
});

client.on("message", (message) => {
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
    }
  }
});
