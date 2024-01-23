const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const storeCatalog = require('../../../plugins/petShop/catalog.json');
const arrays = require('../../../var/arrays');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('animalinfo')
        .setDescription('Show info about pets.')
        .addStringOption(option =>
            option
                .setName('animal')
                .setDescription('The animal you want to know about. check options in /petshop')
                .setRequired(true)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        for (var i = 0; i < storeCatalog.length; i++) {
            if (storeCatalog[i].name.toLowerCase() == interaction.options.getString('animal').toLowerCase()) {
                const petEmbed = new Discord.MessageEmbed()
                    .setColor(arrays.embedColor['store'])
                    .setTitle(storeCatalog[i].name)
                    .addFields({ name: "Energy", value: storeCatalog[i].energy.toString() })
                    .addFields({ name: "Difficulty", value: storeCatalog[i].difficulty })
                let eats = "";
                for (var x = 0; x < storeCatalog[i].eats.length; x++) {
                    eats += `${storeCatalog[i].eats[x]} - `
                }
                petEmbed.addFields({ name: "Eats", value: eats })
                interaction.reply({ embeds: [petEmbed] })
                return
            }
        }
        interaction.reply({ content: "Sorry, i could not find this pet, please make sure you are typing the values as shown in /petshop", ephemeral: true });

    },
};
