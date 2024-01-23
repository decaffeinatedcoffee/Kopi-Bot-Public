const { SlashCommandBuilder } = require('@discordjs/builders');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('nextbdays')
    .setDescription('Displays next guild birthdays.'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let bdays = [];
    interaction.reply({ content: "I'm getting the birthdays, please wait."})
    let cyear;
    let datebase = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    var curYear = new Date(datebase).getFullYear();
    var curMonth = new Date(datebase).getMonth() + 1;
    var curDay = new Date(datebase).getDate();
    for (member of interaction.guild.members.cache) {
      let u = await users.get(member[1].user.id);
      if (u) {
        u = JSON.parse(u);
        if(u.bday){
        let bday = CryptoJS.AES.decrypt(u.bday, process.env.SALT).toString(CryptoJS.enc.Utf8)
        let day = bday.slice(0, 2);
        let month = bday.slice(3, 5);
        let year = bday.slice(6, 10);
        if (curMonth < month) {
          cyear = curYear;
        } else if (curMonth == month && curDay > day) {
          cyear = curYear + 1;
        } else if (curMonth == month && curDay < day) {
          cyear = curYear;
        }
        else {
          cyear = curYear + 1;
        }
        console.log(bday)
        let dt = new Date(months[parseInt(month)].slice(0, 3) + ' ' + day + ' , ' + cyear + ' 00:00:00').getTime();
        bdays.push({ user: member[1].user.tag, dt });
      }
    }
    }
    bdays.sort(function compare(a, b) {
      var dateA = new Date(a.dt);
      var dateB = new Date(b.dt);
      return dateA - dateB;
    });
    const embedbday = new Discord.MessageEmbed()
      .setColor(embedColor["info"])
      .setTitle("Birthdays")
      .setDescription(interaction.guild.name + "'s birthdays")
      .setTimestamp()
    for (var i = 0; i < bdays.length; i++) {
      let d = new Date(bdays[i].dt);
      let dy = d.getDate()
      let my = (d.getMonth() + 1);
      let yy = d.getFullYear()
      if (dy < 10) {
        dy = "0" + dy;
      }
      if (my < 10) {
        my = "0" + my;
      }
      embedbday.addFields({ name: bdays[i].user, value: dy + "/" + my + "/" + yy })
    }
    interaction.editReply({content:null, embeds: [embedbday] })
  },
};
