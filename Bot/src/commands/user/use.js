const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const storeCatalog = require('../../../plugins/store/catalog.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Use something from your inventory.')
        .addStringOption(option =>
            option
                .setName('item')
                .setDescription('The item you want to use.')
                .setRequired(true)
                .setChoices({name:"Cookie 🍪", value:"cookie"},{name:"Apple 🍎", value:"apple"},{name:"Bread 🥖", value:"bread"},{name:"Milk 🥛", value:"milk"}, {name:"Dog food", value:"dog food"},{name:"Cat food", value:"cat food"},{name:"Fish food", value:"fish food"},{name:"Pets Health Regenerator 💊", value:"health regenerator"})
        ),
        async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        if(u){
            u = JSON.parse(u);
           let item = interaction.options.getString('item').toLowerCase();
           for(var i = 0; i < u.inventory.length; i++){
           if(u.inventory[i].name.toLowerCase() == item && u.inventory[i].amount > 0){
            for(var x = 0; x < storeCatalog.length; x++){
            if(storeCatalog[x].name.toLowerCase() == item){
            u.inventory[i].amount = parseInt(u.inventory[i].amount) - 1
            let rv = Math.floor(Math.random() * (2 - 0 + 1) + 0)
            let earns = storeCatalog[x].earns[rv]
            let loss = storeCatalog[x].loss[rv]
            if(earns == 0){
           if(loss > 0){
            u.coins = parseInt(u.coins) - parseInt(loss);
           }
            }else{
            u.coins = parseInt(u.coins) + parseInt(earns);
            }
            users.set(interaction.user.id, JSON.stringify(u));
            interaction.reply(storeCatalog[x].actions[rv])
            return
            }
           }
        }
           }
           interaction.reply({content:"You do not have this item in your inventory.", ephemeral:true});
        }else{
            interaction.reply({content:"You must have an account to use this."})
        }
    },
};
