const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const volumeFunction = (msg, suffix, args) => {

  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

  if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music is being played.'));
  if (!musicbot.canAdjust(msg.member, musicbot.queues.get(msg.guild.id))) return msg.channel.send(musicbot.note('fail', `Only admins or DJ's may change volume.`));

  const dispatcher = voiceConnection.player.dispatcher;

  if (!suffix || isNaN(suffix)) return msg.channel.send(musicbot.note('fail', 'No volume specified.'));

  suffix = parseInt(suffix);

  if (suffix > 200 || suffix <= 0) return msg.channel.send(musicbot.note('fail', 'Volume out of range, must be within 1 to 200'));

  dispatcher.setVolume((suffix / 100));
  musicbot.queues.get(msg.guild.id).volume = suffix;
  msg.channel.send(musicbot.note('note', `Volume changed to ${suffix}%.`));

};

module.exports = volumeFunction;
