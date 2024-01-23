const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Displays the server top XP rank.'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    leaderboard = [];
   interaction.reply("Im generating the leaderboard please wait...");
    for (member of interaction.guild.members.cache) {
      let u = await users.get(member[1].id);
      if (u) {
        u = JSON.parse(u);
        for (var i = 0; i < u.xp.length; i++) {
          if (u.xp[i].id == interaction.guild.id) {
            uxp = u.xp[i];
            if (uxp) {
              uxp = uxp.xp
              leaderboard.push({ user: member[1].user.tag, uxp })
            }
          }
        }
      }
    }
    let xps = [];
    let usernames = [];
    leaderboard.sort((a, b) => b.uxp - a.uxp).slice(0, 10).forEach((user) => { xps.push(user.uxp); usernames.push(user.user); })
    const embedleader = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle("Leaderboard")
      .setTimestamp()
    for (var i = 0; i < usernames.length; i++) {
      embedleader.addFields({ name: (i + 1).toString() + " - " + usernames[i], value: xps[i].toString() + "XP" })
    }
    interaction.editReply({content:null, embeds: [embedleader] })
  },
};
