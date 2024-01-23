const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dicionario')
        .setDescription('Search a portuguese word in Dicio dictionary.')
        .addStringOption(option =>
            option
                .setName('word')
                .setDescription('The word in portuguese you want to see the definition.')
                .setRequired(true)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let word = interaction.options.getString('word').toLowerCase();
        fetch(`https://dicio-api-ten.vercel.app/v2/${word}`)
        .then(function(word){
           return word.json()
        })
        .then(function(meaning){
            if(!meaning.error){
            const dictEmbed = new Discord.MessageEmbed()
                    .setTitle(`${word.toLowerCase()}`)
                    .addFields({ 'name': 'Definition:', value: `${meaning[0].meanings.toString().replaceAll(".,",'.\r\n')}` })
                    .setFooter("Powered by Dicio")
                    .setURL('https://dicio.com.br/' + encodeURIComponent(word.toLowerCase()))
                interaction.reply({ embeds: [dictEmbed] })
            }else{
                interaction.reply("Could not find a meaning for this word in Dicio.")
            }
        })
    },
};
