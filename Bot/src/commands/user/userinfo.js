const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Sends user info.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to see about.')
        .setRequired(false)
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let user;
    if (interaction.options.getMember('user')) {
      user = interaction.options.getMember('user');
    } else {
      user = interaction.member;
    }
    let u = await users.get(user.id);
    if (u) {
      u = JSON.parse(u);
      var marrystatus;
      var userMoney = u.coins;
      var userXP = u.xp[interaction.guild.id];
      var warns = u.warns;
      var marry = u.married;
      if (marry == false) {
        marrystatus = "No"
      } else {
        let x = Math.round(u.marryInfo.at / 1000)
        marrystatus = `Yes, with ${u.marryInfo.username} since <t:${x}>`;
      }
      if (!userMoney) {
        userMoney = 0;
      }
      if (!userXP) {
        userXP = 0;
      }
      if (user.presence == null) {
        var status = "◯ Offline"
        var color = "#9ea39e"
        var user_state = status
      } else {
        if (user.presence.status.toLowerCase() == 'online') {
          var status = "🟢 Online"
        } else if (user.presence.status.toLowerCase() == 'dnd') {
          var status = "🔴 Do not disturb"
        } else if (user.presence.status.toLowerCase() == 'idle') {
          var status = "🌙 Idle"
        }

        if (!user.presence.activities[0]) {
          var user_state = status
          var urlpresence = "";
        } else if (user.presence.activities[0]) {
          if (user.presence.activities[0].id == "custom") {
            var user_state = "";
            for (var i = 1; i < user.presence.activities.length; i++) {
              if (user.presence.activities[i].state != null && user.presence.activities[i].details != null) {
                user_state += user.presence.activities[i].type.toUpperCase().slice(0, 1) + user.presence.activities[i].type.toLowerCase().slice(1) + " " + user.presence.activities[i].name + " - " + user.presence.activities[i].state + " - " + user.presence.activities[i].details + "\r\n\r\n"
              } else if (user.presence.activities[i].state != null && user.presence.activities[i].details == null) {
                user_state += user.presence.activities[i].type.toUpperCase().slice(0, 1) + user.presence.activities[i].type.toLowerCase().slice(1) + " " + user.presence.activities[i].name + " - " + user.presence.activities[i].state + "\r\n\r\n"
              } else if (user.presence.activities[i].state == null && user.presence.activities[i].details != null) {
                user_state += user.presence.activities[i].type.toUpperCase().slice(0, 1) + user.presence.activities[i].type.toLowerCase().slice(1) + " " + user.presence.activities[i].name + " - " + user.presence.activities[i].details + "\r\n\r\n"
              } else if (user.presence.activities[i].state == null && user.presence.activities[i].details == null) {
                user_state += user.presence.activities[i].type.toUpperCase().slice(0, 1) + user.presence.activities[i].type.toLowerCase().slice(1) + " " + user.presence.activities[i].name + "\r\n\r\n"
              }
            }
            user_state = status + ' with custom status "' + user.presence.activities[0].state + '"' + "\r\n" + user_state;
          }
          else {
            user_state = "";
            for (var i = 0; i < user.presence.activities.length; i++) {
              if (user.presence.activities[i].state != null && user.presence.activities[i].details != null) {
                user_state += user.presence.activities[i].type.toUpperCase().slice(0, 1) + user.presence.activities[i].type.toLowerCase().slice(1) + " " + user.presence.activities[i].name + " - " + user.presence.activities[i].state + " - " + user.presence.activities[i].details + "\r\n\r\n"
              } else if (user.presence.activities[i].state != null && user.presence.activities[i].details == null) {
                user_state += user.presence.activities[i].type.toUpperCase().slice(0, 1) + user.presence.activities[i].type.toLowerCase().slice(1) + " " + user.presence.activities[i].name + " - " + user.presence.activities[i].state + "\r\n\r\n"
              } else if (user.presence.activities[i].state == null && user.presence.activities[i].details != null) {
                user_state += user.presence.activities[i].type.toUpperCase().slice(0, 1) + user.presence.activities[i].type.toLowerCase().slice(1) + " " + user.presence.activities[i].name + " - " + user.presence.activities[i].details + "\r\n\r\n"
              } else if (user.presence.activities[i].state == null && user.presence.activities[i].details == null) {
                user_state += user.presence.activities[i].type.toUpperCase().slice(0, 1) + user.presence.activities[i].type.toLowerCase().slice(1) + " " + user.presence.activities[i].name + "\r\n\r\n"
              }
            }
            user_state = status + "\r\n" + user_state;
          }

        }
        if (user.presence.status.toLowerCase() == 'online') {
          var color = "#42db60"
        } else if (user.presence.status.toLowerCase() == 'dnd') {
          var color = "#e32b2b"
        } else if (user.presence.status.toLowerCase() == 'idle') {
          var color = "#d2eb17"
        }
      }

      if (user.user.bot == false) {
        var isbot = "No"
      }
      else {
        var isbot = 'Yes'
      }
      if (!warns) {
        warns = 0;
      }

      let time = Date.parse(user.user.createdAt) / 1000;
      const embedabout = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle('User info')
        .setDescription("<@" + user.id + ">'s account info")
        .setThumbnail("https://cdn.discordapp.com/avatars/" + user.id + "/" + user.user.avatar + ".png")
        .addFields(
          { name: 'ID', value: user.id },
          { name: 'Is a bot?', value: isbot },
          { name: 'Status', value: user_state },
          { name: 'Account creation', value: '<t:' + time + '>' },
          { name: 'Bank Balance', value: Math.round(userMoney.toString()) + " coins" },
          { name: 'Rank', value: userXP.toString() + ' XP (level ' + Math.trunc(userXP / 1000) + ')' },
          { name: 'Married', value: marrystatus.toString() },
          { name: 'Total Warns', value: warns.toString() }
        )
        .setTimestamp()
      interaction.reply({ embeds: [embedabout] });
    } else {
      interaction.reply("This user does not have an account.")
    }
  },
};
