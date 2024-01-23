const { SlashCommandBuilder } = require('@discordjs/builders');
const { handleAudio } = require(__dirname + '../../../../handler/audioPlayerHandler.js');
const fs = require('fs');
var audioPlayer;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the current song.'
    ),
  setPlayerR(x) {
    audioPlayer = x;
  },
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.member.voice.channel) {
      if (fs.existsSync('Playlist.json')) {
        let rawjson = fs.readFileSync('Playlist.json', 'utf8');
        let obj = JSON.parse(rawjson);
        if (interaction.guild.id == obj.interactionGuildID) {
          if (audioPlayer.state.status == "paused") {
            audioPlayer.unpause();
            interaction.reply("Resumed by <@" + interaction.user.id + ">");
          } else {
            interaction.reply({ content: "The player is not paused.", ephemeral: true })
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