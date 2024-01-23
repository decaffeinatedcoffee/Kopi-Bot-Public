const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const { joinVoiceChannel, createAudioResource, AudioPlayerStatus, createAudioPlayer, AudioResource, StreamType, play, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const playdl = require("play-dl")
const yts = require('yt-search');
const fs = require('fs');
const { handleAudio, setIC } = require(__dirname + '../../../../handler/audioPlayerHandler.js');
const { setPlayerR } = require('./resume');
const { setPlayerP } = require('./pause');
const { setPlayerSB } = require('../../../handler/audioPlayerSkipHandler');
const audioPlayer = createAudioPlayer();
let firstPlay = true;
let lastGuild;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays audio in a voice channel')
    .addStringOption(option =>
      option
        .setName('input')
        .setDescription('URL or Name')
        .setRequired(true)
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let URL = interaction.options.getString('input');
    let rawjson;
    let playlist;
    let obj
    if (interaction.member.voice.channel) {
      if (fs.existsSync('Playlist.json')) {
        let rawjson = fs.readFileSync('Playlist.json', 'utf8');
        if (rawjson) {
          obj = JSON.parse(rawjson);
          playlist = obj.playlist
        }
      } else {
        obj = { interactionGuildID: null }
        playlist = [];
        if (firstPlay == true) {
          handleAudio(audioPlayer, client);
          firstPlay = false;
        }
        setPlayerP(audioPlayer);
        setPlayerR(audioPlayer);
        setPlayerSB(audioPlayer);
      }
      if (obj.interactionGuildID == interaction.guild.id || obj.interactionGuildID == null) {
        if(interaction.guild.id != lastGuild){
          setIC(interaction.channel.id);
          lastGuild =  interaction.guild.id;
          }
        await interaction.reply("I'm searching it for you!")
        if (!ytdl.validateURL(URL)) {
          let x = await yts(URL);
          if (x) {
            URL = x.videos[0].url;
          } else {
            URL = undefined;
            interaction.reply({ content: "I can't find any video for this terms, plese try again.", ephemeral: true })
          }
        }
        if (URL) {
          playlist.push(URL);
          json = { interactionChannel: interaction.channel.id, interactionGuildID: interaction.guild.id, playlist: playlist, playlistCounter: 0 }
          json = JSON.stringify(json)
          fs.writeFile('Playlist.json', json, 'utf8', function callback() { });
          ytdl.getInfo(URL).then(data =>
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
            if (playlist.length == 1) {
              let ytstream = await playdl.stream(playlist[0])
              const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
              });
              connection.subscribe(audioPlayer);
              const resource = createAudioResource(ytstream.stream, {
                inputType: ytstream.type,
                inlineVolume: true,
                bitrate: 192000
              })
              const playembed = new Discord.MessageEmbed()
                .setAuthor("By " + interaction.user.username, "https://cdn.discordapp.com/avatars/" + interaction.user.id + "/" + interaction.user.avatar + ".png")
                .setThumbnail(thumbnail)
                .setTimestamp()
              if (hours <= 0) {
                playembed.addFields(
                  {
                    name: "Playing",
                    value: title + " - (" + minutes + ":" + seconds + ") ID " + playlist.length,
                  },
                )
              } else {
                playembed.addFields(
                  {
                    name: "Playing",
                    value: title + " - (" + hours + ":" + minutes + ":" + seconds + ") ID " + playlist.length,
                  },
                )
              }
              playembed.addFields(
                {
                  name: "By",
                  value: channelname,
                })
              if (interaction.member.voice.channel.name) {
                playembed.addFields(
                  {
                    name: "In",
                    value: ":loud_sound: " + interaction.member.voice.channel.name,
                  })
              }
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
              audioPlayer.play(resource);
              interaction.editReply({ content: null, embeds: [playembed] })
            } else {
              const playembed = new Discord.MessageEmbed()
                .setAuthor("By " + interaction.user.username, "https://cdn.discordapp.com/avatars/" + interaction.user.id + "/" + interaction.user.avatar + ".png")
                .setThumbnail(thumbnail)
                .setTimestamp()
              if (hours <= 0) {
                playembed.addFields(
                  {
                    name: "Added",
                    value: title + " - (" + minutes + ":" + seconds + ") ID " + playlist.length,
                  },
                )
              } else {
                playembed.addFields(
                  {
                    name: "Added",
                    value: title + " - (" + hours + ":" + minutes + ":" + seconds + ") ID " + playlist.length,
                  },
                )
              }
              playembed.addFields(
                {
                  name: "By",
                  value: channelname,
                })
              if (interaction.member.voice.channel.name) {
                playembed.addFields(
                  {
                    name: "In",
                    value: ":loud_sound: " + interaction.member.voice.channel.name,
                  })
              }
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
              interaction.editReply({ embeds: [playembed] })
            }
          });
        }
      } else {
        interaction.reply({ content: "Someone is already vibing into another guild, please try again later.", ephemeral: true });
      }
    } else {
      interaction.reply({ content: "You need to join a voice channel first.", ephemeral: true });
    }
  },
}