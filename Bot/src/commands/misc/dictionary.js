const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const ud = require('urban-dictionary')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription('Search a word in urban dictionary.')
        .addStringOption(option =>
            option
                .setName('word')
                .setDescription('The word you want to see the definition.')
                .setRequired(true)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let word = interaction.options.getString('word').toLowerCase();
        ud.define(word, (err, res) => {
            if (res) {
                const dictEmbed = new Discord.MessageEmbed()
                    .setTitle(`${res[0].word}`)
                    .setAuthor(`${res[0].author}`)
                    .addFields({ 'name': 'Definition:', value: `${res[0].definition.replace(/[\[\]']+/g, '')}` })
                    .addFields({ 'name': 'Example:', value: `${res[0].example.replace(/[\[\]']+/g, '')}` })
                    .setFooter("Powered by Urban Dictionary")
                    .setURL('https://www.urbandictionary.com/define.php?term=' + encodeURIComponent(res[0].word))
                interaction.reply({ embeds: [dictEmbed] })
            } else {
                interaction.reply("I could not find any definition for this word in urban dictionary.")
            }
        })
    },
};
