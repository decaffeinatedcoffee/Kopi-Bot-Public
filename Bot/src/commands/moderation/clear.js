const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears the chat')
    .addNumberOption(option =>
      option
        .setName('amount')
        .setDescription('How many messages you want to delete?')
        .setMinValue(1)
        .setMaxValue(50)
        .setRequired(true)
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.member.permissions.has(["MANAGE_ROLES", "BAN_MEMBERS"])) {
      interaction.channel.bulkDelete(interaction.options.getNumber('amount')).then(() => {
        interaction.reply({ content: `The last ${interaction.options.getNumber('amount')} messages were deleted.`, ephemeral: true });
      }).catch(function () {
        interaction.channel.send("Make sure the messages you are trying to delete are not older than 15 days.")
      })
    } else {
      interaction.reply({ content: "Hey! you can not use this!", ephemeral: true });
    }

  },
};