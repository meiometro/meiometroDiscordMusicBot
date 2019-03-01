const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const {YTSearcher} = require('ytsearcher');
const ytpl = require('ytpl');
const musicbot = require('../musicPlayer');

const resumeFunction = (msg, suffix, args) => {

  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
  
  if (voiceConnection === null) {
    return msg.channel.send(musicbot.note('fail', 'No music is being played.'));
  }

  if (!musicbot.isAdmin(msg.member) && !musicbot.anyoneCanPause) {
    return msg.channel.send(musicbot.note('fail', `You cannot resume queues.`));
  }

  const dispatcher = voiceConnection.player.dispatcher;

  if (!dispatcher.paused) return msg.channel.send(musicbot.note('fail', `Music already playing.`))
  else dispatcher.resume();

  msg.channel.send(musicbot.note('note', 'Playback resumed.'));

};

module.exports = resumeFunction;
