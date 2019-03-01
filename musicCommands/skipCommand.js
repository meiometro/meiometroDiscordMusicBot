const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const skipFunction = (msg, suffix, args) => {

  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

  if (voiceConnection === null) {
    return msg.channel.send(musicbot.note('fail', 'No music being played.'));
  }

  const queue = musicbot.getQueue(msg.guild.id);

  if (!musicbot.canSkip(msg.member, queue)) {
    return msg.channel.send(musicbot.note('fail', `You cannot skip this as you didn't queue it.`));
  }

  if (musicbot.queues.get(msg.guild.id).loop == "song") {
    return msg.channel.send(musicbot.note("fail", "Cannot skip while loop is set to single."));
  }

  const dispatcher = voiceConnection.player.dispatcher;

  if (!dispatcher || dispatcher === null) {

    if (musicbot.logging) {
      return console.log(new Error(`dispatcher null on skip cmd [${msg.guild.name}] [${msg.author.username}]`));
    }

    return msg.channel.send(musicbot.note("fail", "Something went wrong running skip."));

  };

  if (voiceConnection.paused) {
    dispatcher.end();
  }

  dispatcher.end();
  msg.channel.send(musicbot.note("note", "Skipped song."));

};

module.exports = skipFunction;
