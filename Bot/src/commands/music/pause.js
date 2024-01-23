const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { handleAudio } = require(__dirname + '../../../../handler/audioPlayerHandler.js');
var audioPlayer;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the current song.'
    ),
  setPlayerP(x) {
    audioPlayer = x;
  },
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.member.voice.channel) {
      if (fs.existsSync('Playlist.json')) {
        let rawjson = fs.readFileSync('Playlist.json', 'utf8');
        let obj = JSON.parse(rawjson);
        if (interaction.guild.id == obj.interactionGuildID) {
          if (audioPlayer.state.status == "playing") {
            audioPlayer.pause();
            interaction.reply("Paused by <@" + interaction.user.id + ">");
          } else {
            interaction.reply({ content: "The player is currently paused.", ephemeral: true })
          }
        } else {
          interaction.reply({ content: "I'm not playing on this guild.", ephemeral: true })
        }
      } else {
        interaction.reply({ content: "I'm not playing.", ephemeral: true })
      }
    } else {
      interaction.reply({ content: "You are not on a voice channel.", ephemeral: true })
    }
  },
}