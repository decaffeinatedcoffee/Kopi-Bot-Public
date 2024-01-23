const { SlashCommandBuilder } = require('@discordjs/builders');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hugs someone.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you wanna hug.')
                .setRequired(true)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        let u2 = await users.get(interaction.options.getUser('user').id);
        if (u) {
            u = JSON.parse(u);
            u.pronouns = JSON.parse(CryptoJS.AES.decrypt(u.pronouns, process.env.SALT).toString(CryptoJS.enc.Utf8))
        } else {
            u = { pronouns: ["they", "them", "their"] }
        }
        if (u2) {
            u2 = JSON.parse(u2);
            u2.pronouns = JSON.parse(CryptoJS.AES.decrypt(u2.pronouns, process.env.SALT).toString(CryptoJS.enc.Utf8))
        } else {
            u2 = { pronouns: ["they", "them", "their"] }
        }
        let opt = [
            `<@${interaction.user.id}> hugs <@${interaction.options.getUser('user').id}>.`,
            `<@${interaction.user.id}> tried to hug <@${interaction.options.getUser('user').id}> but was too shy.`,
            `<@${interaction.user.id}> loves <@${interaction.options.getUser('user').id}> and wanna give ${u2.pronouns[1]} a hug.`
        ]
        var x = Math.floor(Math.random() * opt.length);
        interaction.reply(opt[x])
    },
};
