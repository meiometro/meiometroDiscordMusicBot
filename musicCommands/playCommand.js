const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const {YTSearcher} = require('ytsearcher');
const ytpl = require('ytpl');
const musicbot = require('../musicPlayer');

const executeQueue = (msg, queue) => {

  if (queue.songs.length <= 0) {

    msg.channel.send(musicbot.note('note', 'Playback finished~'));
    musicbot.queues.set(msg.guild.id, {songs: [], last: null, loop: "none", id: msg.guild.id, volume: musicbot.defVolume});

    if (musicbot.musicPresence) {
      musicbot.updatePresence(musicbot.queues.get(msg.guild.id), msg.client, musicbot.clearPresence).catch((res) => { console.warn(`[MUSIC] Problem updating MusicPresence`); });
    }

    const voiceConnection = musicbot.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

    if (voiceConnection !== null) {
      return voiceConnection.disconnect();
    }

  };

  new Promise((resolve, reject) => {

      const voiceConnection = musicbot.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

      if (voiceConnection === null) {

        if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {

          msg.member.voiceChannel.join()
            .then(connection => {
              resolve(connection);
            })
            .catch((error) => {
              console.log(error);
            });

        } else if (!msg.member.voiceChannel.joinable || msg.member.voiceChannel.full) {

          msg.channel.send(musicbot.note('fail', 'I do not have permission to join your voice channel!'))
          reject();

        } else {

          musicbot.emptyQueue(msg.guild.id).then(() => {
            reject();
          });

        }
      } else {
        resolve(voiceConnection);
      }
    }).then(connection => {

      let video;

      if (!queue.last) {
        video = queue.songs[0];
      } else {

        if (queue.loop == "queue") {

          video = queue.songs.find(s => s.position == queue.last.position + 1);

          if (!video || video && !video.url) {
            video = queue.songs[0];
          }

        } else if (queue.loop == "single") {
          video = queue.last;
        } else {
          video = queue.songs.find(s => s.position == queue.last.position + 1);
        };

      }
      if (!video) {

        video = musicbot.queues.get(msg.guild.id).songs ? musicbot.queues.get(msg.guild.id).songs[0] : false;

        if (!video) {

          msg.channel.send(musicbot.note('note', 'Playback finished!'));
          musicbot.emptyQueue(msg.guild.id);

          const voiceConnection = musicbot.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

          if (voiceConnection !== null) {
            return voiceConnection.disconnect();
          }

        }

      }

      if (musicbot.messageNewSong == true && queue.last && musicbot.queues.get(msg.guild.id).loop !== "song") {

        let req = musicbot.client.users.get(video.requester);

        if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {

          const embed = new Discord.RichEmbed()
          .setTitle("Now Playing", `${req !== null ? req.displayAvatarURL : null}`)
          .setThumbnail(`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`)
          .setDescription(`[${video.title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`')}](${video.url}) by [${video.channelTitle}](${video.channelURL})`)
          .setColor(musicbot.embedColor)
          .setFooter(`Requested by ${req !== null ? req.username : "Unknown User"}`, `${req !== null ? req.displayAvatarURL : null}`);
          msg.channel.send({embed});

        } else {
          msg.channel.send(musicbot.note("note", `\`${video.title.replace(/`/g, "''")}\` by \`${video.channelURL.replace(/`/g, "''")}\``))
        }

      }

      try {

        musicbot.setLast(msg.guild.id, video).then(() => {
          if (musicbot.musicPresence) musicbot.updatePresence(musicbot.queues.get(msg.guild.id), msg.client, musicbot.clearPresence).catch((res) => { console.warn(`[MUSIC] Problem updating MusicPresence`); });
        });

        let dispatcher = connection.playStream(ytdl(video.url, {
          filter: 'audioonly'
        }), {
          bitrate: musicbot.bitRate,
          volume: (musicbot.queues.get(msg.guild.id).volume / 100)
        })

        connection.on('error', (error) => {
          console.error(error);
          if (msg && msg.channel) msg.channel.send(musicbot.note('fail', `Something went wrong with the connection. Retrying queue...`));
          musicbot.executeQueue(msg, musicbot.queues.get(msg.guild.id));
        });

        dispatcher.on('error', (error) => {
          console.error(error);
          if (msg && msg.channel) msg.channel.send(musicbot.note('fail', `Something went wrong while playing music. Retrying queue...`));
          musicbot.executeQueue(msg, musicbot.queues.get(msg.guild.id));
        });

        dispatcher.on('end', () => {
          setTimeout(() => {

            let loop = musicbot.queues.get(msg.guild.id).loop;

            if (musicbot.queues.get(msg.guild.id).songs.length > 0) {

              if (loop == "none" || loop == null) {
                
                musicbot.queues.get(msg.guild.id).songs.shift();
                musicbot.updatePositions(musicbot.queues.get(msg.guild.id).songs, msg.guild.id).then(res => {
                  musicbot.queues.get(msg.guild.id).songs = res;
                  musicbot.executeQueue(msg, musicbot.queues.get(msg.guild.id));
                }).catch(() => { console.error(new Error("something went wrong moving the queue")); });

              } else if (loop == "queue" || loop == "song") {
                musicbot.executeQueue(msg, musicbot.queues.get(msg.guild.id));
              };

            } else if (musicbot.queues.get(msg.guild.id).songs.length <= 0) {

              if (msg && msg.channel) {
                msg.channel.send(musicbot.note('note', 'Playback finished.'));
              }

              musicbot.queues.set(msg.guild.id, {songs: [], last: null, loop: "none", id: msg.guild.id, volume: musicbot.defVolume});

              if (musicbot.musicPresence) {
                musicbot.updatePresence(musicbot.queues.get(msg.guild.id), msg.client, musicbot.clearPresence)
                  .catch((res) => { console.warn(`[MUSIC] Problem updating MusicPresence`); });
              }

              const voiceConnection = musicbot.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

              if (voiceConnection !== null) {
                return voiceConnection.disconnect();
              }

            }

          }, 1250);
        });

      } catch (error) {
        console.log(error);
      }
      
    })
    .catch((error) => {
      console.log(error);
    });

};

const playFunction = (msg, suffix, args) => {

  if (msg.member.voiceChannel === undefined) {
    return msg.channel.send(musicbot.note('fail', `You're not in a voice channel.`));
  }

  if (!suffix) {
    return msg.channel.send(musicbot.note('fail', 'No video specified!'));
  }

  let q = musicbot.getQueue(msg.guild.id);
  if (q.songs.length >= musicbot.maxQueueSize && musicbot.maxQueueSize !== 0) {
    return msg.channel.send(musicbot.note('fail', 'Maximum queue size reached!'));
  }

  var searchstring = suffix.trim();
  if (searchstring.includes("https://youtu.be/") || searchstring.includes("https://www.youtube.com/") && searchstring.includes("&")) {
    searchstring = searchstring.split("&")[0];
  }

  if (searchstring.startsWith('http') && searchstring.includes("list=")) {

    msg.channel.send(musicbot.note("search", `Searching playlist items~`));
    
    var playid = searchstring.toString().split('list=')[1];

    if (playid.toString().includes('?')) {
      playid = playid.split('?')[0];
    }

    if (playid.toString().includes('&t=')) {
      playid = playid.split('&t=')[0];
    }

    ytpl(playid, function(err, playlist) {

      if(err) return msg.channel.send(musicbot.note('fail', `Something went wrong fetching that playlist!`));
      if (playlist.items.length <= 0) return msg.channel.send(musicbot.note('fail', `Couldn't get any videos from that playlist.`));
      if (playlist.total_items >= 50) return msg.channel.send(musicbot.note('fail', `Too many videos to queue. A maximum of 50 is allowed.`));

      var index = 0;
      var ran = 0;
      const queue = musicbot.getQueue(msg.guild.id);

      playlist.items.forEach(video => {

        ran++;
        if (queue.songs.length == (musicbot.maxQueueSize + 1) && musicbot.maxQueueSize !== 0 || !video) return;

        video.url = `https://www.youtube.com/watch?v=` + video.id;
        video.channelTitle = video.author.name;
        video.channelURL = video.author.ref;
        video.requester = msg.author.id;
        video.position = musicbot.queues.get(msg.guild.id).songs ? musicbot.queues.get(msg.guild.id).songs.length : 0;
        video.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
        video.requesterAvatarURL = msg.author.displayAvatarURL;
        queue.songs.push(video);

        if (queue.songs.length === 1) musicbot.executeQueue(msg, queue);
        index++;

        if (ran >= playlist.items.length) {
          
          if (index == 0) msg.channel.send(musicbot.note('fail', `Coudln't get any songs from that playlist!`))
          else if (index == 1) msg.channel.send(musicbot.note('note', `Queued one song.`));
          else if (index > 1) msg.channel.send(musicbot.note('note', `Queued ${index} songs.`));

        }

      });

    });

  } else {

    msg.channel.send(musicbot.note("search", `\`Searching: ${searchstring}\`~`));

    new Promise(async (resolve, reject) => {

      let result = await musicbot.searcher.search(searchstring, { type: 'video' });
      resolve(result.first);

    }).then((res) => {

      if (!res) {
        return msg.channel.send(musicbot.note("fail", "Something went wrong. Try again!"));
      }

      res.requester = msg.author.id;
      
      if (searchstring.startsWith("https://www.youtube.com/") || searchstring.startsWith("https://youtu.be/")) {
        res.url = searchstring;
      }
      
      res.channelURL = `https://www.youtube.com/channel/${res.channelId}`;
      res.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
      
      if (musicbot.requesterName) {
        res.requesterAvatarURL = msg.author.displayAvatarURL;
      }
      
      const queue = musicbot.getQueue(msg.guild.id)
      res.position = queue.songs.length ? queue.songs.length : 0;
      queue.songs.push(res);

      if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {

        const embed = new Discord.RichEmbed();

        try {

          embed.setAuthor('Adding To Queue', musicbot.client.user.avatarURL);
          var songTitle = res.title.replace(/\\/g, '\\\\')
          .replace(/\`/g, '\\`')
          .replace(/\*/g, '\\*')
          .replace(/_/g, '\\_')
          .replace(/~/g, '\\~')
          .replace(/`/g, '\\`');
          embed.setColor(musicbot.embedColor);
          embed.addField(res.channelTitle, `[${songTitle}](${res.url})`, musicbot.inlineEmbeds);
          embed.addField("Queued On", res.queuedOn, musicbot.inlineEmbeds);
          
          if (!musicbot.bigPicture) {
            embed.setThumbnail(`https://img.youtube.com/vi/${res.id}/maxresdefault.jpg`);
          }

          if (musicbot.bigPicture) {
            embed.setImage(`https://img.youtube.com/vi/${res.id}/maxresdefault.jpg`);
          }
          
          const resMem = musicbot.client.users.get(res.requester);
          
          if (musicbot.requesterName && resMem) {
            embed.setFooter(`Requested by ${musicbot.client.users.get(res.requester).username}`, res.requesterAvatarURL);
          }

          if (musicbot.requesterName && !resMem) {
            embed.setFooter(`Requested by \`UnknownUser (ID: ${res.requester})\``, res.requesterAvatarURL);
          }
         
          msg.channel.send({
            embed
          });

        } catch (e) {
          console.error(`[${msg.guild.name}] [playCmd] ` + e.stack);
        };

      } else {

        try {

          var songTitle = res.title.replace(/\\/g, '\\\\')
            .replace(/\`/g, '\\`')
            .replace(/\*/g, '\\*')
            .replace(/_/g, '\\_')
            .replace(/~/g, '\\~')
            .replace(/`/g, '\\`');
          msg.channel.send(`Now Playing: **${songTitle}**\nRequested By: ${musicbot.client.users.get(res.requester).username}\nQueued On: ${res.queuedOn}`);

        } catch (e) {
          console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
        };

      };

      if (queue.songs.length === 1 || !musicbot.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) executeQueue(msg, queue);

    }).catch((res) => {
      console.log(new Error(res));
    });

  };

};

module.exports = playFunction;