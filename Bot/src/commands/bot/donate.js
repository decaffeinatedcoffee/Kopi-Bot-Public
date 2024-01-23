const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Get a link to support Kopi.'),
	async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
			interaction.reply({content:"https://www.buymeacoffee.com/decaffeincoffee", ephemeral:true});
	},
};
