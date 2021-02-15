const { Client, MessageEmbed } = require('discord.js');
const client = new Client({
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});

const mongoose = require('mongoose');
mongoose.connect(
  'mongodb+srv://admin:admin123@cluster0.glhhp.mongodb.net/ytc?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const bad = require('bad-words');
const Filter = new bad();

require('dotenv/config');
const fs = require('fs');

const badWords = require('./badWords');
const checkAgainstFilter = require('./functions/checkAgainstFilter');
const runReportCmd = require('./functions/reportCmd');
const oneWord = require('./functions/oneWord');

const storyModel = require('./models/story');

client.on('ready', () => {
  badWords.forEach((word) => {
    Filter.addWords(word);
  });
  console.log('Updated filter!');

  console.log('Bot is up and running!');
});

client.on('message', async (message) => {
  if (message.author.bot) return;

  oneWord(client, message);
  let prefix = '.';

  let args = message.content.slice(prefix.length).trim().split(/ +/gim);
  let command = args.shift().toLowerCase();

  if (command === 'asqry') {
    console.log(process.env);
    console.log(process.env.MODE);
    message.reply(process.env.MODE || "didn't work :(");
  }
  if (command === 'report') {
    runReportCmd(message, args);
  } else if (
    command === 'clearstory' &&
    message.member.permissions.has('ADMINISTRATOR')
  ) {
    message.delete();
    const storyObj = await storyModel.findOne({});
    storyObj.story = '';
    storyObj.save();
    message
      .reply('Successfully reset the story.')
      .then((m) => m.delete({ timeout: 5000 }));
  } else if (
    command === 'currentstory' &&
    message.member.permissions.has('MANAGE_MESSAGES')
  ) {
    message.delete();
    const storyObj = await storyModel.findOne({});

    message.channel.send(
      new MessageEmbed()
        .setTitle('Current Story!')
        .setDescription(storyObj.story.replace(/\\n/gim, '\n'))
        .setTimestamp()
    );
  }
});

client.login(process.env.BOT_TOKEN);
