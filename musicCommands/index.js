'use strict';

const musicbot = require('../musicPlayer');

const playCommand = require('./playCommand');
const helpCommand = require('./helpCommand');
const skipcommand = require('./skipCommand');
const pausecommand = require('./pauseCommand');
const resumeCommand = require('./resumeCommand');
const leaveCommand = require('./leaveCommand');
const nowPlayingCommand = require('./nowPlayingCommand');
const queueCommand = require('./queueCommand');
const searchCommand = require('./searchCommand');
const volumeCommand = require('./volumeCommand');
const clearQueueCommand = require('./clearQueueCommand');
const removeCommand = require('./removeCommand');
const loopCommmand = require('./loopCommand');

module.exports = {

  play: (options) => {
    return {
      enabled: (options.play == undefined ? true : (options.play && typeof options.play.enabled !== 'undefined' ? options.play && options.play.enabled : true)),
      run: (options.play && options.play.run !== undefined && typeof options.play.run === 'function') ?  options.play.run : playCommand,
      alt: (options.play && options.play.alt) || [],
      help: (options.play && options.play.help) || "Queue a song/playlist by URL or name.",
      name: (options.play && options.play.name) || "play",
      usage: (options.play && options.play.usage) || options.botPrefix + "play",
      exclude: Boolean((options && options.play && options.play.exclude)),
      masked: "play"
    }
  },

  help: (options) => {
    return {
      enabled: (options.help == undefined ? true : (options.help && typeof options.help.enabled !== 'undefined' ? options.help && options.help.enabled : true)),
      run: (options.help && options.help.run && typeof options.help.run === 'function') ? options.help.run : helpCommand,
      alt: (options.help && options.help.alt) || [],
      help: (options.help && options.help.help) || "Help for commands.",
      name: (options.help && options.help.name) || "help",
      usage: (options.help && options.help.usage) || options.botPrefix + "help",
      exclude: Boolean((options.help && options.help.exclude)),
      masked: "help"
    }
  },

  pause: (options) => {
    return {
      enabled: (options.pause == undefined ? true : (options.pause && typeof options.pause.enabled !== 'undefined' ? options.pause && options.pause.enabled : true)),
      run: (options.pause && options.pause.run && typeof options.pause.run === 'function') ? options.pause.run : pausecommand,
      alt: (options.pause && options.pause.alt) || [],
      help: (options.pause && options.pause.help) || "Pauses playing music.",
      name: (options.pause && options.pause.name) || "pause",
      usage: (options.pause && options.pause.usage) || options.botPrefix + "pause",
      exclude: Boolean((options.pause && options.pause.exclude)),
      masked: "pause"
    }
  },

  resume: (options) => {
    return {
      enabled: (options.resume == undefined ? true : (options.resume && typeof options.resume.enabled !== 'undefined' ? options.resume && options.resume.enabled : true)),
      run: (options.resume && options.resume.run && typeof options.resume.run === 'function') ? options.resume.run : resumeCommand,
      alt: (options.resume && options.resume.alt) || [],
      help: (options.resume && options.resume.help) || "Resumes a paused queue.",
      name: (options.resume && options.resume.name) || "resume",
      usage: (options.resume && options.resume.usage) || options.botPrefix + "resume",
      exclude: Boolean((options.resume && options.resume.exclude)),
      masked: "resume"
    }
  },

  leave: (options) => {
    return {
      enabled: (options.leave == undefined ? true : (options.leave && typeof options.leave.enabled !== 'undefined' ? options.leave && options.leave.enabled : true)),
      run: (options.leave && options.leave.run && typeof options.leave.run === 'function') ? options.leave.run : leaveCommand,
      alt: (options.leave && options.leave.alt) || [],
      help: (options.leave && options.leave.help) || "Leaves the voice channel.",
      name: (options.leave && options.leave.name) || "leave",
      usage: (options.leave && options.leave.usage) || options.botPrefix + "leave",
      exclude: Boolean((options.leave && options.leave.exclude)),
      masked: "leave"
    }
  },

  queue: (options) => {
    return {
      enabled: (options.queue == undefined ? true : (options.queue && typeof options.queue.enabled !== 'undefined' ? options.queue && options.queue.enabled : true)),
      run: (options.queue && options.queue.run && typeof options.queue.run === 'function') ? options.queue.run : queueCommand,
      alt: (options.queue && options.queue.alt) || [],
      help: (options.queue && options.queue.help) || "View the current queue.",
      name: (options.queue && options.queue.name) || "queue",
      usage: (options.queue && options.queue.usage) || options.botPrefix + "queue",
      exclude: Boolean((options.queue && options.queue.exclude)),
      masked: "queue"
    }
  },

  np: (options) => {
    return {
      enabled: (options.np == undefined ? true : (options.np && typeof options.np.enabled !== 'undefined' ? options.np && options.np.enabled : true)),
      run: (options.np && options.np.run && typeof options.np.run === 'function') ? options.np.run : nowPlayingCommand,
      alt: (options.np && options.np.alt) || [],
      help: (options.np && options.np.help) || "Shows the now playing text.",
      name: (options.np && options.np.name) || "np",
      usage: (options.np && options.np.usage) || options.botPrefix + "np",
      exclude: Boolean((options.np && options.np.exclude)),
      masked: "np"
    }
  },

  loop: (options) => {
    return {
      enabled: (options.loop == undefined ? true : (options.loop && typeof options.loop.enabled !== 'undefined' ? options.loop && options.loop.enabled : true)),
      run: (options.loop && options.loop.run && typeof options.loop.run === 'function') ? options.loop.run : loopCommmand,
      alt: (options.loop && options.loop.alt) || [],
      help: (options.loop && options.loop.help) || "Sets the loop state for the queue.",
      name: (options.loop && options.loop.name) || "loop",
      usage: (options.loop && options.loop.usage) || options.botPrefix + "loop",
      exclude: Boolean((options.loop && options.loop.exclude)),
      masked: "loop"
    }
  },

  search: (options) => {
    return {
      enabled: (options.search == undefined ? true : (options.search && typeof options.search.enabled !== 'undefined' ? options.search && options.search.enabled : true)),
      run: (options.search && options.search.run && typeof options.search.run === 'function') ? options.search.run : searchCommand,
      alt: (options.search && options.search.alt) || [],
      help: (options.search && options.search.help) || "Searchs for up to 10 videos from YouTube.",
      name: (options.search && options.search.name) || "search",
      usage: (options.search && options.search.usage) || options.botPrefix + "search",
      exclude: Boolean((options.search && options.search.exclude)),
      masked: "search"
    }
  },

  clearqueue: (options) => {
    return {
      enabled: (options.clearqueue == undefined ? true : (options.clearqueue && typeof options.clearqueue.enabled !== 'undefined' ? options.clearqueue && options.clearqueue.enabled : true)),
      run: (options.clear && options.clear.run && typeof options.clear.run === 'function') ? options.clear.run : clearQueueCommand,
      alt: (options.clear && options.clear.alt) || [],
      help: (options.clear && options.clear.help) || "Clears the entire queue.",
      name: (options.clear && options.clear.name) || "clear",
      usage: (options.clear && options.clear.usage) || options.botPrefix + "clearqueue",
      exclude: Boolean((options.clearqueue && options.clearqueue.exclude)),
      masked: "clearqueue"
    }
  },

  volume: (options) => {
    return {
      enabled: (options.volume == undefined ? true : (options.volume && typeof options.volume.enabled !== 'undefined' ? options.volume && options.volume.enabled : true)),
      run: (options.volume && options.volume.run && typeof options.volume.run === 'function') ? options.volume.run : volumeCommand,
      alt: (options.volume && options.volume.alt) || [],
      help: (options.volume && options.volume.help) || "Changes the volume output of the bot.",
      name: (options.volume && options.volume.name) || "volume",
      usage: (options.volume && options.volume.usage) || options.botPrefix + "volume",
      exclude: Boolean((options.volume && options.volume.exclude)),
      masked: "volume"
    }
  },

  remove: (options) => {
    return {
      enabled: (options.remove == undefined ? true : (options.remove && typeof options.remove.enabled !== 'undefined' ? options.remove && options.remove.enabled : true)),
      run: (options.remove && options.remove.run && typeof options.remove.run === 'function') ? options.remove.run : removeCommand,
      alt: (options.remove && options.remove.alt) || [],
      help: (options.remove && options.remove.help) || "Remove a song from the queue by position in the queue.",
      name: (options.remove && options.remove.name) || "remove",
      usage: (options.remove && options.remove.usage) || "{{prefix}}remove [position]",
      exclude: Boolean((options.remove && options.remove.exclude)),
      masked: "remove"
    }
  },

  skip: (options) => {
    return {
      enabled: (options.skip == undefined ? true : (options.skip && typeof options.skip.enabled !== 'undefined' ? options.skip && options.skip.enabled : true)),
      run: (options.skip && options.skip.run && typeof options.skip.run === 'function') ? options.skip.run : skipcommand,
      alt: (options.skip && options.skip.alt) || [],
      help: (options.skip && options.skip.help) || "Skip a song or songs with `skip [number]`",
      name: (options.skip && options.skip.name) || "skip",
      usage: (options.skip && options.skip.usage) || options.botPrefix + "skip",
      exclude: Boolean((options.skip && options.skip.exclude)),
      masked: "skip"
    }
  }

}
