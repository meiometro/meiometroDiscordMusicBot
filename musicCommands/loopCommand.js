const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const loopFunction = (msg, suffix, args) => {

  if (!musicbot.queues.has(msg.guild.id)) {
    return msg.channel.send(musicbot.note('fail', `No queue for this server found!`));
  }

  if (musicbot.queues.get(msg.guild.id).loop == "none" || musicbot.queues.get(msg.guild.id).loop == null) {

    musicbot.queues.get(msg.guild.id).loop = "song";
    msg.channel.send(musicbot.note('note', 'Looping single enabled! :repeat_one:'));

  } else if (musicbot.queues.get(msg.guild.id).loop == "song") {

    musicbot.queues.get(msg.guild.id).loop = "queue";
    msg.channel.send(musicbot.note('note', 'Looping queue enabled! :repeat:'));

  } else if (musicbot.queues.get(msg.guild.id).loop == "queue") {

    musicbot.queues.get(msg.guild.id).loop = "none";
    msg.channel.send(musicbot.note('note', 'Looping disabled! :arrow_forward:'));

    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
    const dispatcher = voiceConnection.player.dispatcher;
    let wasPaused = dispatcher.paused;

    if (wasPaused) {
      dispatcher.pause();
    }

    let newq = musicbot.queues.get(msg.guild.id).songs.slice(musicbot.queues.get(msg.guild.id).last.position - 1);

    if (newq !== musicbot.queues.get(msg.guild.id).songs) {
      musicbot.updatePositions(newq, msg.guild.id).then(res => { musicbot.queues.get(msg.guild.id).songs = res; });
    }

    if (wasPaused) {
      dispatcher.resume();
    }

  }

};

module.exports = loopFunction;
