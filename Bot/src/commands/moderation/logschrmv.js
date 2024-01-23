const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('removelogs')
		.setDescription('Remove logs channel.'),
	async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
            let g = await guilds.get(interaction.guild.id);
            if(g){
            g = JSON.parse(g);
            if(g.logsChannel != null){
            g.logsChannel = null;   
            guilds.set(interaction.guild.id, JSON.stringify(g));
            interaction.reply(`The logs channel was removed successfully!`);
            }else{
                interaction.reply(`This guild does not have logs channel already.`);
            }
            }else{
                interaction.reply({content:"This guild has not an account yet!"});
            }
	},
};
