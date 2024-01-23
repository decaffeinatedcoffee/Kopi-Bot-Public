const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Shows your rank on the guild.'),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        if (u) {
            u = JSON.parse(u)
            for (var i = 0; i < u.xp.length; i++) {
                if (u.xp[i].id == interaction.guild.id) {
                    interaction.reply(`You are level ${Math.trunc(parseInt(u.xp[i].xp) / 1000)} with ${u.xp[i].xp}XP`)
                    return;
                }
            }
            interaction.reply({ content: "You don't have XP on this server.", ephemeral: true })
        } else {
            interaction.reply({ content: "You don't have an account.", ephemeral: true })
        }
    },
};

