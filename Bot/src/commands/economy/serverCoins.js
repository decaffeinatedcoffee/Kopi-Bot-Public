const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverbank')
    .setDescription('Shows guild bank balance.'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let g = await guilds.get(interaction.guild.id);
    if (g) {
      g = JSON.parse(g);
      const bal = new Discord.MessageEmbed()
        .setColor(embedColor["bank"])
        .setTitle('GuildBank 🏦')
        .setDescription(`${interaction.guild.name}'s account`)
        .addFields(
          { name: 'Balance', value: `${Math.round(g.coins).toString()} coins.` },
        )
        .setTimestamp();
      interaction.reply({ embeds: [bal] });
    } else {
      interaction.reply({ content: "This guild does not have an account.", ephemeral: true })
    }
  },
};