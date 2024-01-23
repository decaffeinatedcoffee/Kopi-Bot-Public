const { SlashCommandBuilder } = require('@discordjs/builders');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('showbday')
    .setDescription('Displays someones birthday.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you wanna to know the birthday.')
        .setRequired(false)
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let u;
    let uid;
    if (interaction.options.getUser('user')) {
      uid = interaction.options.getUser('user').id
      u = await users.get(interaction.options.getUser('user').id);
    } else {
      u = await users.get(interaction.user.id);
      uid = interaction.user.id;
    }
    if (u) {
      u = JSON.parse(u);
      if (u.bday != null) {
        let datebase = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
        var curYear = new Date(datebase).getFullYear();
        var curMonth = new Date(datebase).getMonth() + 1;
        var curDay = new Date(datebase).getDate();
        var age;
        var cyear;
        let bday = CryptoJS.AES.decrypt(u.bday, process.env.SALT).toString(CryptoJS.enc.Utf8)
        let day = bday.slice(0, 2);
        let month = bday.slice(3, 5);
        let year = bday.slice(6, 10);
        if (curMonth < month) {
          cyear = curYear;
          if (year) {
            age = cyear - year;
          }
        } else if (curMonth == month && curDay > day) {
          cyear = curYear + 1;
          if (year) {
            age = cyear - year;
          }
        } else if (curMonth == month && curDay < day) {
          cyear = curYear;
          if (year) {
            age = cyear - year;
          }
        }
        else {
          cyear = curYear + 1;
          if (year) {
            age = cyear - year;
          }
        }
        var cutTstamp = new Date(datebase).getTime();
        var end = new Date(months[parseInt(month)].slice(0, 3) + ' ' + parseInt(day) + ' , ' + cyear + ' 00:00:00').getTime();
        var rem = end - cutTstamp;
        var dr = Math.floor(rem / (1000 * 60 * 60 * 24));
        var hr = Math.floor((rem % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mr = Math.floor((rem % (1000 * 60 * 60)) / (1000 * 60));
        if (year != "null") {
          if (uid != interaction.user.id) {
            if (curDay == day && curMonth == month) {
              interaction.reply(`🎂 Today is <@"${uid}"> birthday!`)
            } else {
              interaction.reply(`${dr} days, ${hr} hours and ${mr} minutes remaining until <@${uid}>'s ${age} birthday.`);
            }
          } else {
            if (curDay == day && curMonth == month) {
              interaction.reply("🎂 Today is your bday!")
            } else {
              interaction.reply(`${dr} days, ${hr} hours and ${mr} minutes remaining until your ${age} birthday.`);
            }
          }
        } else {
          if (uid != msg.author.id) {
            if (curDay == day && curMonth == month) {
              interaction.reply(`🎂 Today is <@"${uid}"> birthday!`)
            } else {
              interaction.reply(`${dr} days, ${hr} hours and ${mr} minutes remaining until <@${uid}>'s birthday.`);
            }
          } else {
            if (curDay == day && curMonth == month) {
              interaction.reply("🎂 Today is your bday!")
            } else {
              interaction.reply(`${dr} days, ${hr} hours and ${mr} minutes remaining until your birthday.`);
            }
          }
        }
      } else {
        interaction.reply({ content: "This user does not have setted a birth date.", ephemeral: true })
      }
    }
    else {
      interaction.reply({ content: "This user does not have an account.", ephemeral: true })
    }
  },
};
