const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const npFunction = (msg, suffix, args) => {

  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
  const queue = musicbot.getQueue(msg.guild.id, true);

  if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music is being played.'));

  const dispatcher = voiceConnection.player.dispatcher;

  if (musicbot.queues.get(msg.guild.id).songs.length <= 0) {
    return msg.channel.send(musicbot.note('note', 'Queue empty.'));
  }

  if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {

    const embed = new Discord.RichEmbed();

    try {

      embed.setAuthor('Now Playing', client.user.avatarURL);
      var songTitle = queue.last.title.replace(/\\/g, '\\\\')
        .replace(/\`/g, '\\`')
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`');
      embed.setColor(musicbot.embedColor);
      embed.addField(queue.last.channelTitle, `[${songTitle}](${queue.last.url})`, musicbot.inlineEmbeds);
      embed.addField("Queued On", queue.last.queuedOn, musicbot.inlineEmbeds);
      
      if (!musicbot.bigPicture) {
        embed.setThumbnail(`https://img.youtube.com/vi/${queue.last.id}/maxresdefault.jpg`);
      }
      if (musicbot.bigPicture) {
        embed.setImage(`https://img.youtube.com/vi/${queue.last.id}/maxresdefault.jpg`);
      }
      
      const resMem = client.users.get(queue.last.requester);

      if (musicbot.requesterName && resMem) {
        embed.setFooter(`Requested by ${client.users.get(queue.last.requester).username}`, queue.last.requesterAvatarURL);
      }
      if (musicbot.requesterName && !resMem) {
        embed.setFooter(`Requested by \`UnknownUser (ID: ${queue.last.requester})\``, queue.last.requesterAvatarURL);
      }

      msg.channel.send({
        embed
      });

    } catch (e) {
      console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
    };

  } else {

    try {

      var songTitle = queue.last.title.replace(/\\/g, '\\\\')
        .replace(/\`/g, '\\`')
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`');

      msg.channel.send(`Now Playing: **${songTitle}**\nRequested By: ${client.users.get(queue.last.requester).username}\nQueued On: ${queue.last.queuedOn}`);

    } catch (e) {
      console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
    };

  }

};

module.exports = npFunction;
