const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});
const fetch = require('node-fetch')

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
  client.user.setActivity({name: 'you', type: 'WATCHING'})
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
  }
  if (command === 'clearstory' && message.member.permissions.has('ADMINISTRATOR')) {
    message.delete();
    const storyObj = await storyModel.findOne({});
    storyObj.story = '';
    storyObj.save();
    message
      .reply('Successfully reset the story.')
      .then((m) => m.delete({ timeout: 5000 }));
  }
  if (command === 'currentstory' && message.member.permissions.has('MANAGE_MESSAGES')) {
    message.delete();
    const storyObj = await storyModel.findOne({});

    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle('Current Story!')
        .setDescription(storyObj.story.replace(/\\n/gim, '\n'))
        .setTimestamp()
    );
  }
  if(command === 'status'){
    const validStatuses = ['smp']
    if(!args.length) return
    if(!validStatuses.includes(args[0])) return
    if(args[0] === 'smp'){
      const lektonicdata = await fetch('https://api.mcsrvstat.us/2/ytc.lektonic.com').then(response => response.json());
      const worlddata = await fetch('https://api.mcsrvstat.us/2/play.ytc.world').then(response => response.json());
      let lektonic
      let world
      let lektonicmotd
      let worldmotd

      if(!lektonicdata.online){
        lektonic = '❌ Offline or Unreachable'
      } else {
        if(lektonicdata.motd.clean[0]) lektonicmotd = lektonicdata.motd.clean[0]
        if(lektonicdata.motd.clean[1]) lektonicmotd = lektonicmotd + `\n` + lektonicdata.motd.clean[1]
        lektonic = `✅ Online\n\nVersion: ${lektonicdata.version}\nMOTD: \`\`\`\n${lektonicmotd}\n\`\`\`\nPlayers: ${lektonicdata.players.online}/${lektonicdata.players.max}\nSoftware: ${lektonicdata.software}`
      }

      if(!worlddata.online){
        world = '❌ Offline or Unreachable'
      } else {
        if(worlddata.motd.clean[0]) worldmotd = worlddata.motd.clean[0]
        if(worlddata.motd.clean[1]) worldmotd = worldmotd + `\n` + worlddata.motd.clean[1]
        world = `✅ Online\n\nVersion: ${worlddata.version}\nMOTD: \n\`\`\`\n${worldmotd}\n\`\`\`\nPlayers: ${worlddata.players.online}/${worlddata.players.max}\nSoftware: ${worlddata.software}`
      }

      const embed = new Discord.MessageEmbed()
      .setTitle('YTC SMP Status')
      .addField('ytc.lektonic.com', lektonic)
      .addField('play.ytc.world', world)
      .setTimestamp()

      message.channel.send(embed)

    }
  }
});

client.login(process.env.BOT_TOKEN);
