const Discord = require('discord.js');
const musicbot = require('../musicPlayer');

const helpFunction = (msg, suffix, args) => {

  let command = suffix.trim();

  if (!suffix) {

    if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {

      const embed = new Discord.RichEmbed();
      embed.setAuthor("Commands", msg.author.displayAvatarURL);
      embed.setDescription(`Use \`${musicbot.botPrefix}${musicbot.help.name} command name\` for help on usage. Anyone with a role named \`${musicbot.djRole}\` can use any command.`);
      // embed.addField(musicbot.helpCmd, musicbot.helpHelp);

      const newCmds = Array.from(musicbot.commands);
      let index = 0;
      let max = musicbot.commandsArray.length;
      embed.setColor(musicbot.embedColor);

      for (var i = 0; i < musicbot.commandsArray.length; i++) {

        if (!musicbot.commandsArray[i].exclude) {
          embed.addField(musicbot.commandsArray[i].name, musicbot.commandsArray[i].help);
        }

        index++;

        if (index == max) {

          if (musicbot.messageHelp) {

            let sent = false;

            msg.author.send({
                embed
              })
              .then(() => {
                sent = true;
              });

            setTimeout(() => {
              if (!sent) return msg.channel.send({
                embed
              });
            }, 1200);

          } else {
            
            return msg.channel.send({
              embed
            });

          };
        }

      };

    } else {

      var cmdmsg = `= Music Commands =\nUse ${musicbot.botPrefix}${musicbot.help.name} [command] for help on a command. Anyone with a role named \`${musicbot.djRole}\` can use any command.\n`;
      let index = 0;
      let max = musicbot.commandsArray.length;

      for (var i = 0; i < musicbot.commandsArray.length; i++) {

        if (!musicbot.commandsArray[i].disabled || !musicbot.commandsArray[i].exclude) {

          cmdmsg = cmdmsg + `\n• ${musicbot.commandsArray[i].name}: ${musicbot.commandsArray[i].help}`;
          index++;

          if (index == musicbot.commandsArray.length) {

            if (musicbot.messageHelp) {

              let sent = false;

              msg.author.send(cmdmsg, {
                  code: 'asciidoc'
                })
                .then(() => {
                  sent = true;
                });

              setTimeout(() => {
                if (!sent) return msg.channel.send(cmdmsg, {
                  code: 'asciidoc'
                });
              }, 500);

            } else {

              return msg.channel.send(cmdmsg, {
                code: 'asciidoc'
              });

            };

          }

        };

      };

    };

  } else if (musicbot.commands.has(command) || musicbot.aliases.has(command)) {

    if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {

      const embed = new Discord.RichEmbed();
      command = musicbot.commands.get(command) || musicbot.aliases.get(command);

      if (command.exclude) {
        return msg.channel.send(musicbot.note('fail', `${suffix} is not a valid command!`));
      }

      embed.setAuthor(command.name, msg.client.user.avatarURL);
      embed.setDescription(command.help);
      
      if (command.alt.length > 0) {
        embed.addField(`Aliases`, command.alt.join(", "), musicbot.inlineEmbeds);
      }

      if (command.usage && typeof command.usage == "string") {
        embed.addFieldd(`Usage`, command.usage.replace(/{{prefix}})/g, musicbot.botPrefix), musicbot.inlineEmbeds);
      }

      embed.setColor(musicbot.embedColor);
      msg.channel.send({
        embed
      });

    } else {

      command = musicbot.commands.get(command) || musicbot.aliases.get(command);

      if (command.exclude) {
        return msg.channel.send(musicbot.note('fail', `${suffix} is not a valid command!`));
      }

      var cmdhelp = `= ${command.name} =\n`;
      cmdhelp + `\n${command.help}`;

      if (command.usage !== null) {
        cmdhelp = cmdhelp + `\nUsage: ${command.usage.replace(/{{prefix}})/g, musicbot.botPrefix)}`;
      }

      if (command.alt.length > 0) {
        cmdhelp = cmdhelp + `\nAliases: ${command.alt.join(", ")}`;
      }

      msg.channel.send(cmdhelp, {
        code: 'asciidoc'
      });

    };

  } else {
    msg.channel.send(musicbot.note('fail', `${suffix} is not a valid command!`));
  };

};

module.exports = helpFunction;
