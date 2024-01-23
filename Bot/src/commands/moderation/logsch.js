const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setlogs')
		.setDescription('Set up logs channel.')
        .addChannelOption(option =>
        option
          .setName('channel')
          .setDescription('The channel you wanna set as logs and news channel.')
          .setRequired(true)
          ),
	async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
		let channel = interaction.options.getChannel('channel');
        if(channel.type == "GUILD_TEXT"){
            let g = await guilds.get(interaction.guild.id);
            if(g){
            g = JSON.parse(g);
            g.logsChannel = channel.id;
            client.channels.cache.get(channel.id).send("This channel was setted as logs and news channel.").then(function(){
            guilds.set(interaction.guild.id, JSON.stringify(g));
            interaction.reply(`The logs channel was setted as ${channel.name} successfully!`);
        }).catch(function(){
            interaction.reply({content:`I can't send messages to the choosen channel, please make sure i have the permissions and try again.`, ephemeral:true});
        })
            }else{
                interaction.reply({content:"This guild has not an account yet!"});
            }
        }else{
            interaction.reply("Please select a valid text channel.");
        }
	},
};
