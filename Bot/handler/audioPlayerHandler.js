
const { joinVoiceChannel, createAudioResource, AudioPlayerStatus, createAudioPlayer, AudioResource, StreamType, play, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const playdl = require("play-dl");
const fs = require('fs');
let playlistCounter;
let connection;
let ic;
module.exports = {


  async setIC(ichannel){
  ic = ichannel;
  },

  async handleAudio(audioPlayer, client) {

    audioPlayer.on(AudioPlayerStatus.Idle, async () => {
      if (fs.existsSync('Playlist.json')) {
        let rawjson = fs.readFileSync('Playlist.json', 'utf8');
        var obj = JSON.parse(rawjson);
        let interactionChannel = obj.interactionChannel;
        let interactionGuildID = obj.interactionGuildID;
        connection = getVoiceConnection(interactionGuildID);
        let playlist = obj.playlist;
        playlistCounter = obj.playlistCounter;
        obj.playlistCounter = playlistCounter + 1;
        fs.writeFile('Playlist.json', JSON.stringify(obj), 'utf8', function callback() { });
        if (playlistCounter < playlist.length - 1) {
          playlistCounter++;
          let ytstream = await playdl.stream(playlist[playlistCounter])
          const resource = createAudioResource(ytstream.stream, {
            inputType: ytstream.type,
            inlineVolume: true,
            bitrate: 192000
          })
          ytdl.getInfo(playlist[playlistCounter]).then(data =>
          (title = data.videoDetails.title,
            channelname = data.videoDetails.ownerChannelName,
            views = data.videoDetails.viewCount,
            thumbnail = data.videoDetails.thumbnails[1].url,
            totalmediatime = data.videoDetails.lengthSeconds,
            likes = data.videoDetails.likes
          )).then(async function () {
            if (likes == null) {
              likes = "unavailable";
            }
            var hours = Math.floor(totalmediatime / (60 * 60));
            var dm = totalmediatime % (60 * 60);
            var minutes = Math.floor(dm / 60);
            var ds = dm % 60;
            var seconds = Math.ceil(ds);
            if (seconds < 10) {
              seconds = "0" + seconds;
            }
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            const playembed = new Discord.MessageEmbed()
              .setThumbnail(thumbnail)
              .setTimestamp()
            if (hours <= 0) {
              playembed.addFields(
                {
                  name: "Playing",
                  value: title + " - (" + minutes + ":" + seconds + ") " + (playlistCounter + 1) + "/" + playlist.length,
                },
              )
            } else {
              playembed.addFields(
                {
                  name: "Playing",
                  value: title + " - (" + hours + ":" + minutes + ":" + seconds + ") " + (playlistCounter + 1) + "/" + playlist.length,
                },
              )
            }
            playembed.addFields(
              {
                name: "By",
                value: channelname,
              })
            playembed.addFields({
              name: "\u200b",
              value: "👁 " + views + " views",
              inline: true,
            },
              {
                name: "\u200b",
                value: "👍 " + likes + " Likes",
                inline: true,
              }
            )
            client.channels.cache.get(interactionChannel).send({ embeds: [playembed] })
          })
          audioPlayer.play(resource);
        } else {
          connection.disconnect();
          playlistCounter = 0;
          ytstream = "";
          if (fs.existsSync('Playlist.json')) {
            fs.unlinkSync('Playlist.json');
          }
        }
      }

    });
    client.on('voiceStateUpdate', (oldState, newState) => {
      if (oldState.channelId && !newState.channelId) {
        if (newState.id == client.user.id) {
          playlistCounter = 0;
          ytstream = "";
          client.channels.cache.get(ic).send("I left the voice channel, the playlist was cleared.");
          if (fs.existsSync('Playlist.json')) {
            fs.unlinkSync('Playlist.json');
          }
        }   
      }
    });
  }
};