const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const leaveFunction = (msg, suffix) => {

  if (musicbot.isAdmin(msg.member) || musicbot.anyoneCanLeave === true) {

    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

    if (voiceConnection === null) {
      return msg.channel.send(musicbot.note('fail', 'I\'m not in a voice channel.'));
    }

    musicbot.emptyQueue(msg.guild.id);

    if (!voiceConnection.player.dispatcher) return;

    voiceConnection.player.dispatcher.end();
    voiceConnection.disconnect();
    msg.channel.send(musicbot.note('note', 'Successfully left the voice channel.'));

  } else {

    const chance = Math.floor((Math.random() * 100) + 1);

    if (chance <= 10) return msg.channel.send(musicbot.note('fail', `I'm afraid I can't let you do that, ${msg.author.username}.`))
    else return msg.channel.send(musicbot.note('fail', 'Sorry, you\'re not allowed to do that.'));

  }

}

module.exports = leaveFunction;