const { SlashCommandBuilder } = require('@discordjs/builders');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setbirthday')
    .setDescription('Defines your birth date.')
    .addStringOption(option =>
      option
        .setName('date')
        .setDescription('DD/MM or DD/MM/YYYY')
        .setMaxLength(10)
        .setMinLength(5)
        .setRequired(true)
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let u = await users.get(interaction.user.id);
    if (u) {
      u = JSON.parse(u);
      var nums = interaction.options.getString('date').split("/");
      if (nums[0] > 31 || nums[0] <= 0 || !nums[0] || nums[2] > (new Date).getFullYear() || nums[1] > 12 || !nums[1] || nums[1] <= 0 || isNaN(nums[0]) || isNaN(nums[1])) {
        interaction.reply({ content: "Please set a valid date on format DD/MM or DD/MM/YYYY", ephemeral: true })
      }
      else if (nums[1] == 2 && nums[0] >= 30) {
        interaction.reply({ content: "Please set a valid date on format DD/MM or DD/MM/YYYY", ephemeral: true })
      } else if (nums[0] > new Date((new Date).getFullYear(), nums[1], 0).getDate()) {
        interaction.reply({ content: "Please set a valid date on format DD/MM or DD/MM/YYYY", ephemeral: true })
      }
      else {
        var bd = parseInt(nums[0]);
        var bm = parseInt(nums[1]);
        var by = parseInt(nums[2]);
        if (bd < 10) {
          bd = "0" + bd
        }
        if (bm < 10) {
          bm = "0" + bm
        }
        let x;
        if (by) {
          x = `${bd}/${bm}/${by}`
        } else {
          x =`${bd}/${bm}`
        }
        u.bday = CryptoJS.AES.encrypt(x, process.env.SALT).toString();
        users.set(interaction.user.id, JSON.stringify(u));
        interaction.reply(`Your birthday was setted as ${months[parseInt(bm)]} ${days[parseInt(bd)]} successfully.`)
      }
    } else {
      interaction.reply({ content: "You should have an account to use this.", ephemeral: true })
    }

  },
};
