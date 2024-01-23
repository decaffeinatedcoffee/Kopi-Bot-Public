const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const arrays = require('../../../var/arrays');
module.exports = {
        data: new SlashCommandBuilder()
                .setName('petinfo')
                .setDescription('Show your pet status.'),
        async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
               let u = await users.get(interaction.user.id);
               if(u){
                u = JSON.parse(u);
                if(u.pets == null){
                 interaction.reply({content:"You don't have a pet.", ephemeral:true});
                }else{
                    const embedPet = new Discord.MessageEmbed()
                    .setTitle(`${u.pets.name} ${u.pets.icon}`)
                    .setColor(arrays.embedColor['info'])
                    .addFields({name:"Last Meal", value:`<t:${Math.round(u.pets.lastfeed/1000)}:R>`})
                    .addFields({name:"Last Sleep", value:`<t:${Math.round(u.pets.lastsleep/1000)}:R>`})
                    .addFields({name:"Birth date", value:`<t:${Math.round(u.pets.bday/1000)}:D>`})
                    .addFields({name:"Health", value:`${u.pets.life}%`})
                    .addFields({name:"Hunger", value:`${u.pets.hungry}%`})
                    .addFields({name:"Sleep", value:`${u.pets.sleep}%`})
                    interaction.reply({embeds:[embedPet]})
                }
            }else{
                interaction.reply({content:"You should have an account to use this.", ephemeral:true});
               }
        },
};
