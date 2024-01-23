const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
        data: new SlashCommandBuilder()
                .setName('petsleep')
                .setDescription('Put your pet to sleep.'),
        async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
               let u = await users.get(interaction.user.id);
               if(u){
                u = JSON.parse(u);
                if(u.pets == null){
                    interaction.reply({content:"You do not have a pet.", ephemeral:true})
                }else{
                    if(u.pets.sleep >= 50){
                    u.pets.lastsleep = Date.now();
                    u.pets.sleep = 0;
                    users.set(interaction.user.id, JSON.stringify(u));
                    interaction.reply(`${u.pets.name} slept and is now full of energy.`);
                    }else{
                    interaction.reply(`${u.pets.name} is not tired enough to sleep now. (Pets can sleep at 50% or more)`);
                    }
                }
               }else{
                interaction.reply({content:"You should have an account to use this.", ephemeral:true})
               }
               
        },
};
