'use strict';

let _commands = new Map();
let _commandsArray = [];
let _queues = new Map();
let _client = null;

// Options
let _embedColor;
let _anyoneCanSkip;
let _anyoneCanLeave;
let _djRole;
let _anyoneCanPause;
let _anyoneCanAdjust;
let _youtubeKey;
let _botPrefix;
let _defVolume;
let _maxQueueSize;
let _ownerOverMember;
let _botAdmins;
let _ownerID;
let _logging;
let _requesterName;
let _inlineEmbeds;
let _clearOnLeave;
let _messageHelp;
let _dateLocal;
let _bigPicture;
let _messageNewSong;
let _defaultPrefix;
let _channelWhitelist;
let _channelBlacklist;
let _bitRate;
let _cooldown;
let _musicPresence;
let _clearPresence;
let _nextPresence;
let _recentTalk;

class MusicPlayer {
  
  static get commands() { return _commands; };
  static get getCommandsArray() { return _commandsArray; };
  static get queues() { return _queues; };
  static get client() { return _client };
  static get embedColor() { return _embedColor };
  static get anyoneCanSkip() { return _anyoneCanSkip; };
  static get anyoneCanLeave() { return _anyoneCanLeave; };
  static get djRole() { return _djRole; };
  static get anyoneCanPause() { return _anyoneCanPause; };
  static get anyoneCanAdjust() { return _anyoneCanAdjust; };
  static get youtubeKey() { return _youtubeKey; };
  static get botPrefix() { return _botPrefix; };
  static get defVolume() { return _defVolume; };
  static get maxQueueSize() { return _maxQueueSize; };
  static get ownerOverMember() { return _ownerOverMember; };
  static get botAdmins() { return _botAdmins; };
  static get ownerID() { return _ownerID; };
  static get logging() { return _logging; };
  static get requesterName() { return _requesterName; };
  static get inlineEmbeds() { return _inlineEmbeds; };
  static get clearOnLeave() { return _clearOnLeave; };
  static get messageHelp() { return _messageHelp; };
  static get dateLocal() { return _dateLocal; };
  static get bigPicture() { return _bigPicture; };
  static get messageNewSong() { return _messageNewSong; };
  static get defaultPrefix() { return _defaultPrefix; };
  static get channelWhitelist() { return _channelWhitelist; };
  static get channelBlacklist() { return _channelBlacklist; };
  static get bitRate() { return _bitRate; };
  static get cooldown() { return _cooldown; };
  static get musicPresence() { return _musicPresence; };
  static get clearPresence() { return _clearPresence; };
  static get nextPresence() { return _nextPresence; };
  static get recentTalk() { return _recentTalk; };

  static setClient(discordClient) {
    _client = discordClient;
  };

  static setOptions(options) {

    _embedColor = (options && options.embedColor);
    _anyoneCanSkip = (options && typeof options.anyoneCanSkip !== 'undefined' ? options && options.anyoneCanSkip : false);
    _anyoneCanLeave = (options && typeof options.anyoneCanLeave !== 'undefined' ? options && options.anyoneCanLeave : false);
    _djRole = (options && options.djRole) || "DJ";
    _anyoneCanPause = (options && typeof options.anyoneCanPause !== 'undefined' ? options && options.anyoneCanPause : false);
    _anyoneCanAdjust = (options && typeof options.anyoneCanAdjust !== 'undefined' ? options && options.anyoneCanAdjust : false);
    _youtubeKey = (options && options.youtubeKey);
    _botPrefix = (options && options.botPrefix) || "!";
    _defVolume = (options && options.defVolume) || 50;
    _maxQueueSize = (options && options.maxQueueSize) || 50;
    _ownerOverMember = (options && typeof options.ownerOverMember !== 'undefined' ? options && options.ownerOverMember : false);
    _botAdmins = (options && options.botAdmins) || [];
    _ownerID = (options && options.ownerID);
    _logging = (options && typeof options.logging !== 'undefined' ? options && options.logging : true);
    _requesterName = (options && typeof options.requesterName !== 'undefined' ? options && options.requesterName : true);
    _inlineEmbeds = (options && typeof options.inlineEmbeds !== 'undefined' ? options && options.inlineEmbeds : false);
    _clearOnLeave = (options && typeof options.clearOnLeave !== 'undefined' ? options && options.clearOnLeave : true);
    _messageHelp = (options && typeof options.messageHelp !== 'undefined' ? options && options.messageHelp : false);
    _dateLocal = (options && options.dateLocal) || 'en-US';
    _bigPicture = (options && typeof options.bigPicture !== 'undefined' ? options && options.bigPicture : false);
    _messageNewSong = (options && typeof options.messageNewSong !== 'undefined' ? options && options.messageNewSong : true);
    _defaultPrefix = (options && options.defaultPrefix) || "!";
    _channelWhitelist = (options && options.channelWhitelist) || [];
    _channelBlacklist = (options && options.channelBlacklist) || [];
    _bitRate = (options && options.bitRate) || "120000";
  
    _cooldown = {
      enabled: (options && options.cooldown ? options && options.cooldown.enabled : true),
      timer: parseInt((options && options.cooldown && options.cooldown.timer) || 10000),
      exclude: (options && options.cooldown && options.cooldown.exclude) || ["volume","queue","pause","resume","np"]
    };
  
    _musicPresence = options.musicPresence || false;
    _clearPresence = options.clearPresence || false;
    _nextPresence = (options && options.nextPresence) || null;
    _recentTalk = new Set();
  
  };

  static isAdmin(member) {

    if (member.roles.find(r => r.name == djRole)) return true;
    if (ownerOverMember && member.id === botOwner) return true;
    if (botAdmins.includes(member.id)) return true;
  
    return member.hasPermission("ADMINISTRATOR");
  
  };

  static canSkip(member, queue) {

    if (this.anyoneCanSkip) return true;
    else if (this.botAdmins.includes(member.id)) return true;
    else if (this.ownerOverMember && member.id === this.botOwner) return true;
    else if (queue.last.requester === member.id) return true;
    else if (this.isAdmin(member)) return true;
    else return false;
  
  };

  static canAdjust(member, queue) {

    if (this.anyoneCanAdjust) return true;
    else if (this.botAdmins.includes(member.id)) return true;
    else if (this.ownerOverMember && member.id === this.botOwner) return true;
    else if (queue.last.requester === member.id) return true;
    else if (this.isAdmin(member)) return true;
    else return false;
  
  };

  static getQueue(server) {
    
    if (!_queues.has(server)) {
      _queues.set(server, {songs: new Array(), last: null, loop: "none", id: server,volume: _defVolume});
    };
  
    return _queues.get(server);
  
  };

  static setLast(server, last) {

    return new Promise((resolve, reject) => {
  
      if (_queues.has(server)) {
  
        let q = _queues.get(server);
        q.last = last;
        _queues.set(server, q);
  
        resolve(_queues.get(server));
  
      } else {
        reject("no server queue");
      };
  
    });
  
  };

  static getLast(server) {

    return new Promise((resolve, reject) => {
  
      let q = _queues.has(server) ? _queues.get(server).last : null;
      if (!q || !q.last) resolve(null)
      else if (q.last) resolve(q.last);
  
    });
  
  };

  static emptyQueue(server) {

    return new Promise((resolve, reject) => {
  
      if (!_queues.has(server)) reject(new Error(`[emptyQueue] no queue found for ${server}`));
      _queues.set(server, {songs: [], last: null, loop: "none", id: server, volume: _defVolume});
      resolve(_queues.get(server));
  
    });
  
  };

  static async updatePresence(queue, client, clear) {

    return new Promise((resolve, reject) => {
  
      if (this.nextPresence !== null) clear = false;
      if (!queue || !client) reject("invalid arguments");
  
      if (queue.songs.length > 0 && queue.last) {
  
        client.user.setPresence({
          game: {
            name: "🎵 | " + queue.last.title,
            type: 'PLAYING'
          }
        });
  
        resolve(client.user.presence);
  
      } else {
  
        if (clear) {
  
          client.user.setPresence({ game: { name: null} });
          resolve(client.user.presence);
  
        } else {
  
          if (this.nextPresence !== null) {
  
            let props;
            
            if (this.nextPresence.status && ["online","dnd","idle","invisible"].includes(this.nextPresence.status)) props.status = this.nextPresence.status;
            if (this.nextPresence.afk && typeof this.nextPresence.afk == "boolean") props.afk = this.nextPresence.afk;
            if (this.nextPresence.game && typeof this.nextPresence.game == "string") props.game = {name: this.nextPresence.game}
            else if (this.nextPresence.game && typeof this.nextPresence.game == "object") props.game = this.nextPresence.game;
  
            client.user.setPresence(props).catch((res) => {
  
              console.error("[MUSICBOT] Could not update presence\n" + res);
              client.user.setPresence({ game: { name: null} });
              resolve(client.user.presence);
  
            }).then((res) => {
              resolve(res);
            });
  
          } else {
  
            client.user.setPresence({
              game: {
                name: "🎵 | nothing",
                type: 'PLAYING'
              }
            });
  
          }
  
          resolve(client.user.presence);
  
        };
  
      };
  
    });
  
  };

  static updatePrefix(server, prefix) {
    
    if (typeof prefix == undefined) prefix = _defaultPrefix;
    if (typeof _botPrefix != "object") _botPrefix = new Map();
    _botPrefix.set(server, {prefix: prefix});
  
  };

  static note(type, text) {

    if (type === 'wrap') {
      
      let ntext = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'REMOVED');
      return '```\n' + ntext + '\n```';

    } else if (type === 'note') {
      return ':musical_note: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
    } else if (type === 'search') {
      return ':mag: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
    } else if (type === 'fail') {
      return ':no_entry_sign: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
    } else if (type === 'font') {

      return text.replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(/\\/g, '\\\\')
      .replace(/\*/g, '\\*')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\~')
      .replace(/`/g, '\\`');

    } else {
      console.error(new Error(`${type} was an invalid type`));
    }

  };

}

module.exports = MusicPlayer;
