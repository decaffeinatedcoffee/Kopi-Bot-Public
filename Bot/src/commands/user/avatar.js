const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Sends user avatar.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The user you want the avatar.')
				.setRequired(true)
		),
	async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
		if (interaction.options.getUser('user').avatar) {
			const embedaavatar = new Discord.MessageEmbed()
				.setColor(embedColor["info"])
				.setTitle('Here is the user avatar')
				.setImage("https://cdn.discordapp.com/avatars/" + interaction.options.getUser('user').id + "/" + interaction.options.getUser('user').avatar + ".png?size=2048")
				.setTimestamp()
			interaction.reply({ embeds: [embedaavatar] });
		}

		else {
			interaction.reply({ content: "Hm, this user does not have a profile picture yet.", ephemeral: true })
		}
	},
};
