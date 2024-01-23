const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('servercount')
		.setDescription('Shows the amount of servers the bot are in.'),
	async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
		interaction.reply("I'm currently in " + client.guilds.cache.size + " servers!");
	},
};
