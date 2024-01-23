const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('registerguild')
    .setDescription('Creates guild bot account'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.member.permissions.has(["MANAGE_ROLES", "BAN_MEMBERS"])) {
      let g = await guilds.get(interaction.guild.id);
      if(!g){
        let json = { tax: 0, coins: 0, logsChannel: null, wordfilter:[], markovEnabled:true, markovDB:[]}
        guilds.set(interaction.guild.id, JSON.stringify(json));
        interaction.reply({ content: "The guild was registered successfully!", ephemeral: true });
      }else{
        interaction.reply({ content: "This guild has an account already.", ephemeral: true });
      }
    } else {
      interaction.reply({ content: "Hey! you can not use this!", ephemeral: true });
    }

  },
};