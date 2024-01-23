const { joinVoiceChannel, createAudioResource, AudioPlayerStatus, createAudioPlayer, AudioResource, StreamType, play, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const playdl = require("play-dl");
const fs = require('fs');
var audioPlayer;
module.exports = {
  setPlayerSB(x) {
    audioPlayer = x;
  },
  async skipback(newState, interaction) {
    if (interaction.member.voice.channel) {
      if (fs.existsSync('Playlist.json')) {
        let rawjson = fs.readFileSync('Playlist.json', 'utf8');
        let obj = JSON.parse(rawjson);
        let interactionChannel = obj.interactionChannel;
        let interactionGuildID = obj.interactionGuildID;
        let playlist = obj.playlist;
        let playlistCounter = obj.playlistCounter;
        if (newState == "skip") {
          playlistCounter++;
          obj.playlistCounter = playlistCounter
        } else if (newState == "back") {
          playlistCounter = parseInt(playlistCounter) - 1;
          obj.playlistCounter = playlistCounter
        }
        fs.writeFile('Playlist.json', JSON.stringify(obj), 'utf8', function callback() { });
        if (playlistCounter <= playlist.length) {
          obj.playlistCounter = playlistCounter;
          fs.writeFile('Playlist.json', JSON.stringify(obj), 'utf8', function callback() { });
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
            interaction.channel.send({ embeds: [playembed] })
          })
          audioPlayer.play(resource);
        }
      }
    }
  }
}