const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('Shows you bank balance.'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let u = await users.get(interaction.user.id);
    if (u) {
      u = JSON.parse(u);
      const bal = new Discord.MessageEmbed()
        .setColor(embedColor["bank"])
        .setTitle('Bank 🏦')
        .setDescription(`<@${interaction.user.id}>'s account`)
        .addFields(
          { name: 'Balance', value: `${Math.round(u.coins).toString()} coins.` },
        )
        .setTimestamp();
      interaction.reply({ embeds: [bal] });
    } else {
      interaction.reply({ content: "You should have an account to use this.", ephemeral: true })
    }
  },
};