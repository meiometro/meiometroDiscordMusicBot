const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const clearFunction = (msg, suffix, args) => {

  if (!musicbot.queues.has(msg.guild.id)) {
    return msg.channel.send(musicbot.note("fail", "No queue found for this server."));
  }

  if (!musicbot.isAdmin(msg.member)) {
    return msg.channel.send(musicbot.note("fail", `Only Admins or people with the ${musicbot.djRole} can clear queues.`));
  }

  musicbot.emptyQueue(msg.guild.id).then(res => {

    msg.channel.send(musicbot.note("note", "Queue cleared."));
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

    if (voiceConnection !== null) {

      const dispatcher = voiceConnection.player.dispatcher;

      if (!dispatcher || dispatcher === null) {

        if (musicbot.logging) {
          return console.log(new Error(`dispatcher null on skip cmd [${msg.guild.name}] [${msg.author.username}]`));
        }

        return msg.channel.send(musicbot.note("fail", "Something went wrong."));

      };

      if (voiceConnection.paused) {
        dispatcher.end();
      }

      dispatcher.end();
    }

  }).catch(res => {

    console.error(new Error(`[clearCmd] [${msg.guild.id}] ${res}`))
    return msg.channel.send(musicbot.note("fail", "Something went wrong clearing the queue."));

  });

};

module.exports = clearFunction;
