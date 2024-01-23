const { SlashCommandBuilder } = require('@discordjs/builders');
const arrays = require('../../../var/arrays.js')
const Discord = require("discord.js");
const ud = require('urban-dictionary')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Turns a word into emojis.')
        .addStringOption(option =>
            option
                .setName('word')
                .setDescription('The word you want to emojify.')
                .setRequired(true)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let word = interaction.options.getString('word').toLowerCase();
        let emojified = '';
        for(var i = 0; i < word.length; i++){
            if(arrays.emojiAlphabet[word[i]]){
                emojified += arrays.emojiAlphabet[word[i]]
            }else{
               emojified += word[i]; 
            }
        }
        interaction.reply(emojified)
    },
};
