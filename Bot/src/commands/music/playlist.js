const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const fs = require('fs')
let playlist;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Shows server playlist.'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    const pembed = new Discord.MessageEmbed()
      .setTitle("Playlist");
    if (fs.existsSync('Playlist.json')) {
      let rawjson = fs.readFileSync('Playlist.json', 'utf8');
      var obj = JSON.parse(rawjson);
      playlist = obj.playlist;
      if (obj.interactionGuildID == interaction.guild.id) {
        interaction.reply("I'm fetching this guild playlist, please wait.")
        for (var i = 0; i < playlist.length; i++) {
          if (playlist[i]) {
            t = await ytdl.getInfo(playlist[i])
            if (i != obj.playlistCounter) {
              pembed.addFields({ "name": (i + 1).toString(), "value": t.videoDetails.title })
            } else {
              pembed.addFields({ "name": (i + 1).toString(), "value": "**" + t.videoDetails.title + "**" })
            }
          }
        }
        interaction.editReply({ content: null, embeds: [pembed] });
      } else {
        interaction.reply({ content: "This server does not have a playlist.", ephemeral: true })
      }
    } else {
      interaction.reply({ content: "This server does not have a playlist.", ephemeral: true })
    }
  },
};
