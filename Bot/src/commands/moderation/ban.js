const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban some user from the guild.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to say goodbye.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('cause')
        .setDescription('Why this user is getting banned?')
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
      interaction.options.getMember('user').ban({
        reason: cause,
      }).then(function () {
        const embedban = new Discord.MessageEmbed()
          .setColor(embedColor['purges'])
          .setAuthor("By mod: " + interaction.user.username, "https://cdn.discordapp.com/avatars/" + interaction.user.id + "/" + interaction.user.avatar + ".png")
          .setThumbnail("https://cdn.discordapp.com/avatars/" + interaction.options.getUser('user').id + "/" + interaction.options.getUser('user').avatar + ".png")
          .setTitle('Punished user:')
          .addFields(
            { name: 'Nickname', value: interaction.options.getUser('user').username },
            { name: 'Cause', value: cause },
          )
          .setTimestamp()

          .setFooter('User were banned successsfully!');
        if (interaction.options.getAttachment('proofs')) {
          if (interaction.options.getAttachment('proofs').contentType.startsWith('image')) {
            embedban.setImage(interaction.options.getAttachment('proofs').url)
          }
        }
        interaction.reply({ embeds: [embedban] });
      })
        .catch(function (err) {
          interaction.reply({ content: "I could not ban this user.", ephemeral: true });
        })
    }
  },
};