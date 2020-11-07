if (content.startsWith(PREFIX)) {
  /*=============================================
    =            About array destructuring            =
    =============================================*/

  //array destructuring to make first element of the array is going to be put into the variable CMD_NAME then everything after will be inside the args variable which will be an arg
  // ie. $greet user => cmdname = greet and user is ['user']
  // ie. $greet u s e r => cmdname = greet and user is ['u','s','e','r']

  /*=====  End of About array destructuring  ======*/

  const [CMD_NAME, ...args] = message.content
    .trim() //Trim is for taking away the white space at the start and ends
    .substring(PREFIX.length) //sub string to get part of the start namely the string after the prefix.
    .split(/\s+/); //split to make an array at the white space
  if (CMD_NAME === "kick") {
    //you'll need to give the bot permissions for this
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.reply("You don't have permissions to kick users.");
    if (args.length === 0) return message.reply("Please provide a user");
    const member = message.guild.members.cache.get(args[0]); //cache is basically a Collection, contains the
    //snowflakes and GuildMember
    //get is a method for a Map because the methods a Collection has
    // will store the GuildMember object inside of member
    if (member) {
      member
        .kick()
        .then((member) => message.channel.send(member, "was kicked.")) // is a promise, will return GuildMember
        .catch((error) => message.channel.send("I can't kick ", member));
    } else {
      message.channel.send(`That member was not found`);
    }
  } else if (CMD_NAME === "ban") {
    //user doesn't have to be in the server. Just has to exist. Errors on non-existing users.
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.reply("You don't have permissions to kick users.");
    if (args.length === 0) return message.reply("Please provide a user");

    try {
      const user = await message.guild.members.ban(args[0]); //gives a user resolvable => user object, snowflake(id),
      //message, GuildMember
      message.channel.send("User was banned successfully.");
    } catch (error) {
      message.channel.send(
        `I couldn't do that. Either I don't have permissions or that user doesn't exists.`
      );
    }
  }
}
