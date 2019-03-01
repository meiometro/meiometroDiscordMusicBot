const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const queueFunction = (msg, suffix, args) => {

  if (!musicbot.queues.has(msg.guild.id)) {
    return msg.channel.send(musicbot.note("fail", "Could not find a queue for this server."));
  }
  else if (musicbot.queues.get(msg.guild.id).songs.length <= 0) {
    return msg.channel.send(musicbot.note("fail", "Queue is empty."));
  }

  const queue = musicbot.queues.get(msg.guild.id);

  if (suffix) {

    let video = queue.songs.find(s => s.position == parseInt(suffix) - 1);

    if (!video) {
      return msg.channel.send(musicbot.note("fail", "Couldn't find that video."));
    }

    const embed = new Discord.RichEmbed()
    .setAuthor('Queued Song', client.user.avatarURL)
    .setColor(musicbot.embedColor)
    .addField(video.channelTitle, `[${video.title.replace(/\\/g, '\\\\')
      .replace(/\`/g, '\\`')
      .replace(/\*/g, '\\*')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\~')
      .replace(/`/g, '\\`')}](${video.url})`, musicbot.inlineEmbeds)
    .addField("Queued On", video.queuedOn, musicbot.inlineEmbeds)
    .addField("Position", video.position + 1, musicbot.inlineEmbeds);

    if (!musicbot.bigPicture) {
      embed.setThumbnail(`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`);
    }

    if (musicbot.bigPicture) {
      embed.setImage(`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`);
    }

    const resMem = client.users.get(video.requester);

    if (musicbot.requesterName && resMem) {
      embed.setFooter(`Requested by ${client.users.get(video.requester).username}`, video.requesterAvatarURL);
    }

    if (musicbot.requesterName && !resMem) {
      embed.setFooter(`Requested by \`UnknownUser (ID: ${video.requester})\``, video.requesterAvatarURL);
    }

    msg.channel.send({embed});

  } else {

    if (queue.songs.length > 11) {

      let pages = [];
      let page = 1;
      const newSongs = queue.songs.musicArraySort(10);

      newSongs.forEach(s => {

        var i = s.map((video, index) => (
          `**${video.position + 1}:** __${video.title.replace(/\\/g, '\\\\')
            .replace(/\`/g, '\\`')
            .replace(/\*/g, '\\*')
            .replace(/_/g, '\\_')
            .replace(/~/g, '\\~')
            .replace(/`/g, '\\`')}__`
        )).join('\n\n');

        if (i !== undefined) {
          pages.push(i);
        }

      });

      const embed = new Discord.RichEmbed();
      embed.setAuthor('Queued Songs', client.user.avatarURL);
      embed.setColor(musicbot.embedColor);
      embed.setFooter(`Page ${page} of ${pages.length}`);
      embed.setDescription(pages[page - 1]);

      msg.channel.send(embed).then(m => {

        m.react('⏪').then( r => {

          m.react('⏩');
          let forwardsFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === '⏩' && user.id === msg.author.id, { time: 120000 });
          let backFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id, { time: 120000 });

          forwardsFilter.on('collect', r => {
            if (page === pages.length) return;
            page++;
            embed.setDescription(pages[page - 1]);
            embed.setFooter(`Page ${page} of ${pages.length}`, msg.author.displayAvatarURL);
            m.edit(embed);
          });

          backFilter.on('collect', r => {
            if (page === 1) return;
            page--;
            embed.setDescription(pages[page - 1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            m.edit(embed);
          });

        });

      });

    } else {

      var newSongs = musicbot.queues.get(msg.guild.id).songs.map(
        (video, index) => (`**${video.position + 1}:** __${video.title.replace(/\\/g, '\\\\')
          .replace(/\`/g, '\\`')
          .replace(/\*/g, '\\*')
          .replace(/_/g, '\\_')
          .replace(/~/g, '\\~')
          .replace(/`/g, '\\`')}__`)).join('\n\n');

      const embed = new Discord.RichEmbed();
      embed.setAuthor('Queued Songs', client.user.avatarURL);
      embed.setColor(musicbot.embedColor);
      embed.setDescription(newSongs);
      embed.setFooter(`Page 1 of 1`, msg.author.displayAvatarURL);
      return msg.channel.send(embed);

    };

  };

};

module.exports = queueFunction;
