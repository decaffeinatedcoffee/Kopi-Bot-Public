const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick some user from the guild.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to say bye.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('cause')
        .setDescription('Why this user is getting kicked?')
        .setRequired(false)
    ).addAttachmentOption(option =>
      option
        .setName('proofs')
        .setDescription('Screenshots')
        .setRequired(false)
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.member.permissions.has(["MANAGE_ROLES", "BAN_MEMBERS"])) {
      let cause = interaction.options.getString('cause');
      if (!cause) {
        cause = "No cause was given."
      }
      interaction.options.getMember('user').kick(cause).then(function () {
        const embedkick = new Discord.MessageEmbed()
          .setColor(embedColor['purges'])
          .setAuthor("By mod: " + interaction.user.username, "https://cdn.discordapp.com/avatars/" + interaction.user.id + "/" + interaction.user.avatar + ".png")
          .setThumbnail("https://cdn.discordapp.com/avatars/" + interaction.options.getUser('user').id + "/" + interaction.options.getUser('user').avatar + ".png")
          .setTitle('Punished user:')
          .addFields(
            { name: 'Nickname', value: interaction.options.getUser('user').username },
            { name: 'Cause', value: cause },
          )
          .setTimestamp()
          .setFooter('User were kicked successsfully!');
        if (interaction.options.getAttachment('proofs')) {
          if (interaction.options.getAttachment('proofs').contentType.startsWith('image')) {
            embedkick.setImage(interaction.options.getAttachment('proofs').url)
          }
        }
        interaction.reply({ embeds: [embedkick] });
      })
        .catch(function (err) {
          interaction.reply({ content: "I could not kick this user.", ephemeral: true });
        })
    }
  },
};