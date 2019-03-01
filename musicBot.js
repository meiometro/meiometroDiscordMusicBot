const {YTSearcher} = require('ytsearcher');
const Discord = require('discord.js');
const PACKAGE = require('./package.json');
const musicCommands = require('./musicCommands');
const musicbot = require('./musicPlayer');

exports.start = (client, options) => {

  try {

    if (process.version.slice(1).split('.')[0] < 8) {
      console.error(new Error(`[MusicBot] node v8 or higher is needed, please update`));
      process.exit(1);
    };

    musicbot.setClient(client);
    musicbot.setOptions(options);

    musicbot.searcher = new YTSearcher(musicbot.youtubeKey);
    musicbot.changeKey = (key) => {

      return new Promise((resolve, reject) => {

        if (!key || typeof key !== "string") reject("key must be a string");
        
        musicbot.youtubeKey = key;
        musicbot.searcher.key = key;

        resolve(musicbot);

      });

    };

    client.on("ready", () => {

      console.log(`------- meio_metro Discord Music Bot -------\n> Version: ${PACKAGE.version}.\n> Node.js Version: ${process.version}\n------- meio_metro Discord Music Bot -------`);
      
      if (musicbot.cooldown.exclude.includes("skip")) console.warn(`[MUSIC BOT] Excluding SKIP CMD from cooldowns can cause issues.`);
      if (musicbot.cooldown.exclude.includes("play")) console.warn(`[MUSIC BOT] Excluding PLAY CMD from cooldowns can cause issues.`);
      if (musicbot.cooldown.exclude.includes("remove")) console.warn(`[MUSIC BOT] Excluding REMOVE CMD from cooldowns can cause issues.`);
      if (musicbot.cooldown.exclude.includes("search")) console.warn(`[MUSIC BOT] Excluding SEARCH CMD from cooldowns can cause issues.`);

      setTimeout(() => { if (musicbot.musicPresence == true && musicbot.client.guilds.length > 1) console.warn(`[MUSIC BOT] MusicPresence is enabled with more than one server!`); }, 2000);

    });

    client.on("message", (msg) => {

      if (msg.author.bot || musicbot.channelBlacklist.includes(msg.channel.id)) return;
      if (msg.content.indexOf(musicbot.botPrefix) !== 0) return;
      if (musicbot.channelWhitelist.length > 0 && !musicbot.channelWhitelist.includes(msg.channel.id)) return;
      
      const message = msg.content.trim();
      const prefix = typeof musicbot.botPrefix == "object" ? (musicbot.botPrefix.has(msg.guild.id) ? musicbot.botPrefix.get(msg.guild.id).prefix : musicbot.defaultPrefix) : musicbot.botPrefix;
      const commandName = message.substring(prefix.length).split(/[ \n]/)[0].trim();
      const suffix = message.substring(prefix.length + commandName.length).trim();
      const args = message.slice(prefix.length + commandName.length).trim().split(/ +/g);

      if (message.startsWith(prefix) && msg.channel.type == "text") {

        try {
          
          let command = musicCommands[commandName];

          if (command) {
            command(options).run(msg, suffix, args);
          }
          
        } catch(ex) {
          console.log(ex);
          
        }
        
      }

    });

  } catch (e) {
    console.error(e);
  };
  
}
    