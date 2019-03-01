const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const pauseFunction = (msg, suffix, args) => {

  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

  if (voiceConnection === null) {
    return msg.channel.send(musicbot.note('fail', 'No music being played.'));
  }

  if (!musicbot.isAdmin(msg.member) && !musicbot.anyoneCanPause) {
    return msg.channel.send(musicbot.note('fail', 'You cannot pause queues.'));
  }

  const dispatcher = voiceConnection.player.dispatcher;

  if (dispatcher.paused) return msg.channel.send(musicbot.note(`fail`, `Music already paused!`))
  else dispatcher.pause();

  msg.channel.send(musicbot.note('note', 'Playback paused.'));

};

module.exports = pauseFunction;
