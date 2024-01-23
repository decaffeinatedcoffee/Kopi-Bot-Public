const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const storeCatalog = require('../../../plugins/petShop/catalog.json');
const arrays = require('../../../var/arrays');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('petshop')
        .setDescription('Get a new pet.')
        .addStringOption(option =>
            option
                .setName('animal')
                .setDescription('The animal you want to have as pet.')
                .setChoices({name:"Dog 🐕 - 1300 coins", value:'dog'},{name:"Cat 🐱 - 2500 coins", value:'cat'},{name:'Fish 🐟 - 5000 coins', value:'fish'})
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('What name you want to give to your pet?')
                .setRequired(true)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        let petName = interaction.options.getString('name');
        if (u) {
            u = JSON.parse(u);
            if (u.pets == null) {
                for (var i = 0; i < storeCatalog.length; i++) {
                    if (storeCatalog[i].name.toLowerCase() == interaction.options.getString('animal').toLowerCase()) {
                        if (u.coins >= storeCatalog[i].price) {
                            u.coins = parseInt(u.coins) - parseInt(storeCatalog[i].price);
                            u.pets = { name: petName, icon:storeCatalog[i].icon, type: storeCatalog[i].name.toLowerCase(), lastfeed: Date.now(), lastsleep: Date.now(), "hungry": 0, "sleep": 0, life: 100, bday: Date.now(), eats:storeCatalog[i].eats, channelID: interaction.channel.id }
                            users.set(interaction.user.id, JSON.stringify(u));
                            interaction.reply(`You bought a ${storeCatalog[i].name.toLowerCase()} successfully! I hope you and ${petName} have fun.`);
                            return
                        } else {
                            interaction.reply({ content: "You don't have enough money for this." });
                            return;
                        }
                    }
                }
                interaction.reply({ content: "Sorry, i could not find this pet, make sure you are typing the name as it is shown in /petshop", ephemeral: true })
            } else {
                interaction.reply({ content: "You already have a pet.", ephemeral: true })
            }
        } else {
            interaction.reply({ content: "You should have an account to use this.", ephemeral: true })
        }
    },
};
