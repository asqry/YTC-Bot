const { MessageEmbed } = require("discord.js");
const { oneWordStory } = require("../config");
require("mongoose");
const storyModel = require("../models/story");

const addToStory = async (str) => {
  const storyObj = await storyModel.findOne({});
  if (!storyObj) {
    let data = new storyModel({
      story: str,
    });

    data.save();

    return;
  } else {
    storyObj.story = storyObj.story + str;
    storyObj.save();
  }
};

module.exports = async (client, message) => {
  if (message.channel.id !== oneWordStory) return;
  if (message.content.trim().startsWith(".") && message.content.length > 1)
    return;
  if (message.content.split(/ +/g).length > 1) {
    message.delete();
    message
      .reply("Please only one word at a time!")
      .then((m) => m.delete({ timeout: 2000 }));
    return;
  } else {
    addToStory(" " + message.content.replace(/\./g, ""));
  }

  if (message.content.trim() === ".") {
    let ch = client.channels.cache.find((c) => c.id === oneWordStory);

    addToStory(` \`- Ended by: ${message.author.tag}\`\n`);
    const storyObj = await storyModel.findOne({});

    let m = await ch.send(
      new MessageEmbed()
        .setTitle("Current Story!")
        .setDescription(
          storyObj.story + ` \`- Ended by: ${message.author.tag}\``
        )
    );
    m.pin();
  }
};
