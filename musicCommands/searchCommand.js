const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const {YTSearcher} = require('ytsearcher');
const ytpl = require('ytpl');
const musicbot = require('../musicPlayer');

const searchFunction = (msg, suffix, args) => {

  if (msg.member.voiceChannel === undefined) {
    return msg.channel.send(musicbot.note('fail', `You're not in a voice channel~`));
  }

  if (!suffix) {
    return msg.channel.send(musicbot.note('fail', 'No video specified!'));
  }

  const queue = musicbot.getQueue(msg.guild.id);

  if (queue.songs.length >= musicbot.maxQueueSize && musicbot.maxQueueSize !== 0) {
    return msg.channel.send(musicbot.note('fail', 'Maximum queue size reached!'));
  }

  let searchstring = suffix.trim();
  msg.channel.send(musicbot.note('search', `Searching: \`${searchstring}\``))
    .then(response => {
      musicbot.searcher.search(searchstring, {
          type: 'video'
        })
        .then(searchResult => {
          if (!searchResult.totalResults || searchResult.totalResults === 0) return response.edit(musicbot.note('fail', 'Failed to get search results.'));

          const startTheFun = async (videos, max) => {
            if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
              const embed = new Discord.RichEmbed();
              embed.setTitle(`Choose Your Video`);
              embed.setColor(musicbot.embedColor);
              var index = 0;
              videos.forEach(function(video) {
                index++;
                embed.addField(`${index} (${video.channelTitle})`, `[${musicbot.note('font', video.title)}](${video.url})`, musicbot.inlineEmbeds);
              });
              embed.setFooter(`Search by: ${msg.author.username}`, msg.author.displayAvatarURL);
              msg.channel.send({
                embed
              })
              .then(firstMsg => {
                var filter = null;
                if (max === 0) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 1) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 2) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 3) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 4) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 5) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 6) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.includes('7') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 7) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.includes('7') ||
                  m.content.includes('8') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 8) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.includes('7') ||
                  m.content.includes('8') ||
                  m.content.includes('9') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 9) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.includes('7') ||
                  m.content.includes('8') ||
                  m.content.includes('9') ||
                  m.content.includes('10') ||
                  m.content.trim() === (`cancel`);
                }
                msg.channel.awaitMessages(filter, {
                  max: 1,
                  time: 60000,
                  errors: ['time']
                })
                .then(collected => {
                  const newColl = Array.from(collected);
                  const mcon = newColl[0][1].content;

                  if (mcon === "cancel") return firstMsg.edit(musicbot.note('note', 'Searching canceled.'));
                  const song_number = parseInt(mcon) - 1;
                  if (song_number >= 0) {
                    firstMsg.delete();

                    videos[song_number].requester == msg.author.id;
                    videos[song_number].position = queue.songs.length ? queue.songs.length : 0;
                    var embed = new Discord.RichEmbed();
                    embed.setAuthor('Adding To Queue', client.user.avatarURL);
                    var songTitle = videos[song_number].title.replace(/\\/g, '\\\\')
                    .replace(/\`/g, '\\`')
                    .replace(/\*/g, '\\*')
                    .replace(/_/g, '\\_')
                    .replace(/~/g, '\\~')
                    .replace(/`/g, '\\`');
                    embed.setColor(musicbot.embedColor);
                    embed.addField(videos[song_number].channelTitle, `[${songTitle}](${videos[song_number].url})`, musicbot.inlineEmbeds);
                    embed.addField("Queued On", videos[song_number].queuedOn, musicbot.inlineEmbeds);
                    if (!musicbot.bigPicture) embed.setThumbnail(`https://img.youtube.com/vi/${videos[song_number].id}/maxresdefault.jpg`);
                    if (musicbot.bigPicture) embed.setImage(`https://img.youtube.com/vi/${videos[song_number].id}/maxresdefault.jpg`);
                    const resMem = client.users.get(videos[song_number].requester);
                    if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(videos[song_number].requester).username}`, videos[song_number].requesterAvatarURL);
                    if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${videos[song_number].requester})\``, videos[song_number].requesterAvatarURL);
                    msg.channel.send({
                      embed
                    }).then(() => {
                      queue.songs.push(videos[song_number]);
                      if (queue.songs.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue);
                    })
                    .catch(console.log);
                  };
                })
                .catch(collected => {
                  if (collected.toString()
                  .match(/error|Error|TypeError|RangeError|Uncaught/)) return firstMsg.edit(`\`\`\`xl\nSearching canceled. ${collected}\n\`\`\``);
                  return firstMsg.edit(`\`\`\`xl\nSearching canceled.\n\`\`\``);
                });
              })
            } else {
              const vids = videos.map((video, index) => (
                `**${index + 1}:** __${video.title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`')}__`
              )).join('\n\n');
              msg.channel.send(`\`\`\`\n= Pick Your Video =\n${vids}\n\n= Say Cancel To Cancel =`).then(firstMsg => {
                var filter = null;
                if (max === 0) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 1) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 2) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 3) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 4) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 5) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 6) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.includes('7') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 7) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.includes('7') ||
                  m.content.includes('8') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 8) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.includes('7') ||
                  m.content.includes('8') ||
                  m.content.includes('9') ||
                  m.content.trim() === (`cancel`);
                } else if (max === 9) {
                  filter = m => m.author.id === msg.author.id &&
                  m.content.includes('1') ||
                  m.content.includes('2') ||
                  m.content.includes('3') ||
                  m.content.includes('4') ||
                  m.content.includes('5') ||
                  m.content.includes('6') ||
                  m.content.includes('7') ||
                  m.content.includes('8') ||
                  m.content.includes('9') ||
                  m.content.includes('10') ||
                  m.content.trim() === (`cancel`);
                }
                msg.channel.awaitMessages(filter, {
                  max: 1,
                  time: 60000,
                  errors: ['time']
                })
                .then(collected => {
                  const newColl = Array.from(collected);
                  const mcon = newColl[0][1].content;

                  if (mcon === "cancel") return firstMsg.edit(musicbot.note('note', 'Searching canceled.'));
                  const song_number = parseInt(mcon) - 1;
                  if (song_number >= 0) {
                    firstMsg.delete();

                    videos[song_number].requester == msg.author.id;
                    videos[song_number].position = queue.songs.length ? queue.songs.length : 0;
                    var embed = new Discord.RichEmbed();
                    embed.setAuthor('Adding To Queue', client.user.avatarURL);
                    var songTitle = videos[song_number].title.replace(/\\/g, '\\\\')
                    .replace(/\`/g, '\\`')
                    .replace(/\*/g, '\\*')
                    .replace(/_/g, '\\_')
                    .replace(/~/g, '\\~')
                    .replace(/`/g, '\\`');
                    embed.setColor(musicbot.embedColor);
                    embed.addField(videos[song_number].channelTitle, `[${songTitle}](${videos[song_number].url})`, musicbot.inlineEmbeds);
                    embed.addField("Queued On", videos[song_number].queuedOn, musicbot.inlineEmbeds);
                    if (!musicbot.bigPicture) embed.setThumbnail(`https://img.youtube.com/vi/${videos[song_number].id}/maxresdefault.jpg`);
                    if (musicbot.bigPicture) embed.setImage(`https://img.youtube.com/vi/${videos[song_number].id}/maxresdefault.jpg`);
                    const resMem = client.users.get(videos[song_number].requester);
                    if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(videos[song_number].requester).username}`, videos[song_number].requesterAvatarURL);
                    if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${videos[song_number].requester})\``, videos[song_number].requesterAvatarURL);
                    msg.channel.send({
                      embed
                    }).then(() => {
                      queue.songs.push(videos[song_number]);
                      if (queue.songs.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue);
                    })
                    .catch(console.log);
                  };
                })
                .catch(collected => {
                  if (collected.toString()
                  .match(/error|Error|TypeError|RangeError|Uncaught/)) return firstMsg.edit(`\`\`\`xl\nSearching canceled. ${collected}\n\`\`\``);
                  return firstMsg.edit(`\`\`\`xl\nSearching canceled.\n\`\`\``);
                });
              })
            }
          };

          const max = searchResult.totalResults >= 10 ? 9 : searchResult.totalResults - 1;
          var videos = [];
          for (var i = 0; i < 99; i++) {
            var result = searchResult.currentPage[i];
            result.requester = msg.author.id;
            if (musicbot.requesterName) result.requesterAvatarURL = msg.author.displayAvatarURL;
            result.channelURL = `https://www.youtube.com/channel/${result.channelId}`;
            result.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
            videos.push(result);
            if (i === max) {
              i = 101;
              startTheFun(videos, max);
            }
          };
        });
    })
    .catch(console.log);
};

module.exports = searchFunction;
