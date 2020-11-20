module.exports = {
  run: async (client, message, args) => {
    const checkRolePermissions = (role) =>
      role.permissions.has("ADMINISTRATOR") ||
      role.permissions.has("KICK_MEMBERS") ||
      role.permissions.has("BAN_MEMBERS") ||
      role.permissions.has("MANAGE_CHANNELS") ||
      role.permissions.has("MANAGE_GUILD");

    let roleSet = new Set(args);
    let { cache } = message.guild.roles;

    roleSet.forEach((roleName) => {
      let roleTag = cache.find((role) => role.name.toLowerCase() === roleName);
      if (roleTag) {
        if (message.member.roles.cache.has(roleTag.id)) {
          message.channel.send("You have this role already.");
          return;
        }
        if (checkRolePermissions(roleTag)) {
          message.channel.send(`You cannot add yourself to ${roleTag.name}.`);
        } else {
          message.member.roles
            .add(roleTag)
            .then((member) =>
              message.channel.send(`You were added to ${roleTag.name}.`)
            )
            .catch((error) => {
              console.error(error);
              message.channel.send("Something went wrong...");
            });
        }
      } else {
        message.channel.send("Role not found!");
      }
    });
  },
  aliases: ['addrole', 'roleadd', 'role']
};
