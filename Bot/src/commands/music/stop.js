const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { joinVoiceChannel, createAudioResource, AudioPlayerStatus, createAudioPlayer, AudioResource, StreamType, play, getVoiceConnection } = require('@discordjs/voice');
const { handleAudio } = require(__dirname + '../../../../handler/audioPlayerHandler.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the song'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.member.voice.channel) {
      if (fs.existsSync('Playlist.json')) {
        let rawjson = fs.readFileSync('Playlist.json', 'utf8');
        let obj = JSON.parse(rawjson);
        if (interaction.guild.id == obj.interactionGuildID) {
          const connection = getVoiceConnection(interaction.guild.id);
          connection.disconnect();
          if (fs.existsSync('Playlist.json')) {
            fs.unlinkSync('Playlist.json');
          }
          interaction.reply(`The player was stopped by <@${interaction.user.id}>`)
        } else {
          interaction.reply({ content: "I'm not playing on this guild.", ephemeral: true })
        }
      } else {
        interaction.reply({ content: "Theres no playlist.", ephemeral: true })
      }
    } else {
      interaction.reply({ content: "You are not on a voice channel.", ephemeral: true })
    }
  },
}
