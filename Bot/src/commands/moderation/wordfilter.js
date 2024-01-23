const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('wordfilter')
    .setDescription('Add or remove words from filter.')
    .addStringOption(option =>
        option
          .setName('action')
          .setDescription('The action you want to execute.')
          .setChoices({name:"Add", value: 'add'}, {name:"Remove", value:"remove"})
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('word')
          .setDescription('The word you want to add/remove filter.')
          .setRequired(true)
      ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.member.permissions.has(["MANAGE_ROLES", "BAN_MEMBERS"])) {
      let word = interaction.options.getString('word').toLowerCase();
      let action = interaction.options.getString('action').toLowerCase();
      let g = await guilds.get(interaction.guild.id);
      if(g){
        g = JSON.parse(g);
        if(action == "add"){
        if(!g.wordfilter.includes(word)){
         g.wordfilter.push(word);
         interaction.reply({content:"This Word is now being filtered.", ephemeral:true})
         guilds.set(interaction.guild.id, JSON.stringify(g))
        }else{
            interaction.reply({content:"This Word is already being filtered.", ephemeral:true})
        }
        }else if(action == "remove"){
            if(g.wordfilter.includes(word)){
                g.wordfilter = g.wordfilter.filter(function(e) { return e !== word })
                interaction.reply({content:"This is now not being filtered.", ephemeral:true})
                guilds.set(interaction.guild.id, JSON.stringify(g))
               }else{
                interaction.reply({content:"This is already not being filtered.", ephemeral:true})
               }
        }
      }else{
        interaction.reply({content:"This guild does not have an account on the bot.", ephemeral:true})
      }
    }else{
        interaction.reply({content:"Hey! you can not use this."})
    }
  },
};