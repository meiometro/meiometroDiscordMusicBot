const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const {YTSearcher} = require('ytsearcher');
const ytpl = require('ytpl');
const musicbot = require('../musicPlayer');

const removeFunction = (msg, suffix, args) => {

  if (!musicbot.queues.has(msg.guild.id)) {
    return msg.channel.send(musicbot.note('fail', `No queue for this server found!`));
  }

  if (!suffix) {
    return msg.channel.send(musicbot.note("fail", "No video position given."));
  }

  if (parseInt(suffix - 1) == 0) {
    return msg.channel.send(musicbot.note("fail", "You cannot clear the currently playing music."));
  }

  let test = musicbot.queues.get(msg.guild.id).songs.find(x => x.position == parseInt(suffix - 1));

  if (test) {

    if (test.requester !== msg.author.id && !musicbot.isAdmin(msg.member)) return msg.channel.send(musicbot.note("fail", "You cannot remove that item."));

    let newq = musicbot.queues.get(msg.guild.id).songs.filter(s => s !== test);

    musicbot.updatePositions(newq, msg.guild.id).then(res => {

      musicbot.queues.get(msg.guild.id).songs = res;
      msg.channel.send(musicbot.note("note", `Removed:  \`${test.title.replace(/`/g, "'")}\``));

    });

  } else {
    msg.channel.send(musicbot.note("fail", "Couldn't find that video or something went wrong."));
  }

};

module.exports = removeFunction;
