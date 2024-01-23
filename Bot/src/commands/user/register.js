const { SlashCommandBuilder } = require('@discordjs/builders');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register to bot.'),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        if (!u) {
            let p = CryptoJS.AES.encrypt('["they", "them", "their"]', process.env.SALT).toString();
            let x = { coins: 0, bday: null, warns: 0, warnData: [], blacklisted: false, married: false, pets: null, inventory:[],lastWork: null, lastDaily: null, xp: [], pronouns: p }
            users.set(interaction.user.id, JSON.stringify(x))
            interaction.reply("You was successfully registered!")
        } else {
            interaction.reply({ content: "You already have an account.", ephemeral: true })
        }
    },
};
