module.exports = async (message, args) => {
  let user = message.mentions.members.first() || message.guild.member(args[0]);

  if (!user) {
    return message
      .reply("Report failed -> Please specify a person or ID to report.")
      .then((m) => m.delete({ timeout: 5000 }));
  } else {
    let reason = args.slice(1).join(" ");
    if (!reason) {
      return message
        .reply("Report failed -> Please specify a reason to report.")
        .then((m) => m.delete({ timeout: 5000 }));
    } else {
      const config = require("../config");
      let ch = message.guild.channels.cache.find(
        (c) => c.id === config.reportChannel
      );
      message.delete();
      message.channel
        .send("Report successful.")
        .then((m) => m.delete({ timeout: 5000 }));
      ch.send(
        `${message.author} -> reported ${user} (\`${user.id}\`) for \`${reason}\` \n \`\`\`${message.createdAt}\`\`\`\n\nPlease react with ✅ when this report has been dealt with.`
      );
    }
  }
};
