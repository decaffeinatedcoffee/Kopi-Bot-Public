const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { skipback } = require(__dirname + '../../../../handler/audioPlayerSkipHandler.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Goes back to the previous song.'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.member.voice.channel) {
      if (fs.existsSync('Playlist.json')) {
        let rawjson = fs.readFileSync('Playlist.json', 'utf8');
        let obj = JSON.parse(rawjson);
        let interactionChannel = obj.interactionChannel;
        let interactionGuildID = obj.interactionGuildID;
        let playlist = obj.playlist;
        let playlistCounter = obj.playlistCounter;
        if (interaction.guild.id == interactionGuildID) {
          if (playlistCounter - 1 >= 0) {
            skipback("back", interaction)
            interaction.reply("Returned by <@" + interaction.user.id + ">");
          } else {
            interaction.reply({ content: "This playlist has no previous song yet.", ephemeral: true })
          }
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
