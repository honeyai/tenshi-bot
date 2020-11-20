module.exports = {
  run: async (client, message, args) => {
  let roleSet = new Set(args);
  let { cache } = message.guild.roles;

  roleSet.forEach((roleName) => {
    let roleTag = cache.find((role) => role.name.toLowerCase() === roleName);
    if (roleTag) {
      if (message.member.roles.cache.has(roleTag.id)) {
        message.member.roles
          .remove(roleTag)
          .then((member) =>
            message.channel.send(`You were removed from ${roleTag.name}.`)
          )
          .catch((error) => {
            console.error(error);
            message.channel.send("Something went wrong...");
          });
      } else if (!message.member.roles.cache.has(roleTag.id)) {
        message.channel.send("You don't have this role to remove.");
      }
    } else {
      message.channel.send("Role not found!");
    }
  });
},
  alias: ['removerole', 'rmrole'],
  description: "Remove a role from yourself"
};
