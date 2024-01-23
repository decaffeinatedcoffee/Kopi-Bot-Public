const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn some user from the guild.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to warn.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('cause')
        .setDescription('Why this user is getting warned?')
        .setRequired(false)
    )
    .addAttachmentOption(option =>
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
      if (interaction.user.id == interaction.options.getUser('user').id || interaction.options.getUser('user') == client.user.id) {
        interaction.reply({ content: "You can not warn yourself or the bot" })
      } else {
        var proofs;
        const embedwarn = new Discord.MessageEmbed()
          .setColor(embedColor['purges'])
          .setAuthor("By mod: " + interaction.user.username, "https://cdn.discordapp.com/avatars/" + interaction.user.id + "/" + interaction.user.avatar + ".png")
          .setThumbnail("https://cdn.discordapp.com/avatars/" + interaction.options.getUser('user').id + "/" + interaction.options.getUser('user').avatar + ".png")
          .setTitle('Punished user:')
          .addFields(
            { name: 'Nickname', value: interaction.options.getUser('user').username },
            { name: 'Cause', value: cause },
          )
          .setTimestamp()
          .setFooter('User were warned successsfully!');
        if (interaction.options.getAttachment('proofs')) {
          if (interaction.options.getAttachment('proofs').contentType.startsWith('image')) {
            proofs = interaction.options.getAttachment('proofs').url
            embedwarn.setImage(interaction.options.getAttachment('proofs').url)
          } else {
            proofs = null
          }
        } else {
          proofs = null
        }
        let u = await users.get(interaction.options.getUser('user').id);
        if (u) {
          u = JSON.parse(u);
        } else {
          let p = CryptoJS.AES.encrypt('["they", "them", "their"]', process.env.SALT).toString();
          u = { coins: 0, bday: null, warns: 0, warnData: [], blacklisted: false, married: false, pets: null, lastWork: null, lastDaily: null, xp: [], pronouns: p }
        }
        u.warns = parseInt(u.warns) + 1;
        u.warnData.push({ id: parseInt(u.warnData.length), cause: cause, author: interaction.user.username, authorID: interaction.user.id, atGuild: interaction.guild.id, guildName: interaction.guild.name, guildIcon: interaction.guild.icon,in: Date.now(), proofs: proofs})
        users.set(interaction.options.getUser('user').id, JSON.stringify(u))
        interaction.options.getMember('user').send({ embeds: [embedwarn] })
        interaction.reply({ embeds: [embedwarn] });
      }
    }
  },
};