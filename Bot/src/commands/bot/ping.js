const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with bot latency.'),
	async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
		interaction.channel.send("lorem ipsum dolor sit amet consectetur adipisicing elit. pariatur, assumenda est? ratione in alias nulla repudiandae, incidunt nisi recusandae consequuntur quidem quasi placeat reiciendis. quidem aliquid repudiandae sequi officiis nihil?").then(pingMessage => {
			var ping = pingMessage.createdTimestamp - interaction.createdTimestamp;
			const pingEmbed = new Discord.MessageEmbed()
				.setColor(embedColor["info"])
				.setDescription("🏓 Pong!")
				.addFields(
					{ name: "The bot server latency is ", value: ping + "ms" },
					{ name: "The Discord API latency is ", value: client.ws.ping + "ms" },
				)
				.setTimestamp()
			pingMessage.delete();
			interaction.reply({ embeds: [pingEmbed] });
		});
	},
};
