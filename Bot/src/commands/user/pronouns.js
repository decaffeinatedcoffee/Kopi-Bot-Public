const { SlashCommandBuilder } = require('@discordjs/builders');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pronouns')
        .setDescription('Sets you account pronouns.')
        .addNumberOption(option =>
            option
                .setName('option')
                .setDescription('Select the pronouns you want.')
                .setMaxValue(3)
                .setMinValue(1)
                .setRequired(true)
                .setChoices({name:"They, Them, Their",value:1},{name:"She, Her, Hers",value:2},{name:"He, Him, His",value:3})
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        if (u) {
            u = JSON.parse(u);
            let list = ['["they", "them", "their"]', '["she", "her", "hers"]', '["he", "him", "his"]'];
            let lj = JSON.parse(`[${list}]`);
            u.pronouns = CryptoJS.AES.encrypt(list[parseInt(interaction.options.getNumber('option')) - 1], process.env.SALT).toString();
            users.set(interaction.user.id, JSON.stringify(u));
            interaction.reply({ content: `Your pronouns were changed to ${lj[parseInt(interaction.options.getNumber('option')) - 1][0]}/${lj[parseInt(interaction.options.getNumber('option')) - 1][1]}`, ephemeral: true });
        } else {
            interaction.reply({ content: "You should have an account to use this.", ephemeral: true })
        }
    },
};