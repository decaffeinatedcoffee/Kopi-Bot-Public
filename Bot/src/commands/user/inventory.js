const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const arrays = require('../../../var/arrays');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Show your inventory.'),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        if(u){
            u = JSON.parse(u);
            const embedInv = new Discord.MessageEmbed()
            .setColor(arrays.embedColor["info"])
            .setTitle(`${interaction.user.username}'s inventory.`)
            for(var i = 0; i < u.inventory.length; i++){
                if(u.inventory[i].amount > 0){
                embedInv.addFields({'name':`${u.inventory[i].name} ${u.inventory[i].icon}`, 'value': `${u.inventory[i].amount}`})
                }
            }
            interaction.reply({embeds:[embedInv]})
        }else{
            interaction.reply({content:"You should have an account to use this.", ephemeral:true});
        }
    },
};
