const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('guildinfo')
    .setDescription('Sends guild info.'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let owner = await interaction.guild.fetchOwner()
    let icon = interaction.guild.iconURL();
    let nsfwl = "Unknown";
    let nsfwd = interaction.guild.nsfwLevel.toLowerCase();
    if(nsfwd == "default" || nsfwd == 0){
     nsfwl = "Default Level";
    }else if(nsfwd == "explicit" || nsfwd == 1){
    nsfwl = "Explicit content";
    }else if(nsfwd == "safe" || nsfwd == 2){
     nsfwl = "Safe";
    }else if(nsfwd == "age_restricted" || nsfwd == 3){
        nsfwl = "Age Restricted";
    }
    if(icon == null){
        icon = "https://kopibot.cyclic.app/images/wpdata/imagenotfound.png";
    }
    let guildEmbed = new Discord.MessageEmbed()
    .setTitle(`${interaction.guild.name}'s guild infos`)
    .setThumbnail(icon)
    .addFields({name:"Created at:", value: `<t:${Math.round(interaction.guild.createdAt/1000)}:D>`})
    .addFields({name:"By:", value: owner.user.username})
    .addFields({name:"Members:", value: interaction.guild.memberCount.toString()})
    .addFields({name:"Roles:", value: interaction.guild.roles.cache.size.toString()})
    .addFields({name:"Emojis:", value: interaction.guild.emojis.cache.size.toString()})
    .addFields({name:"NSFW Level:", value:nsfwl})
    .addFields({name:"Language:", value:interaction.guild.preferredLocale})
    
    interaction.reply({embeds:[guildEmbed]})
  },
};
