const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('yearprogressbar')
        .setDescription('Generates the current year progress bar.'),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let datebase = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
        var yy = new Date(datebase).getFullYear();
        let yearDuration = new Date(yy, 1, 29).getDate() === 29 ? 366 : 365;
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var d = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var x = 1000 * 60 * 60 * 24;
        var yearDay = Math.floor(d / x);
        let remaining = yearDuration - yearDay;
        let percent = 100 - ((remaining * 100) / yearDuration);
        let empty = ".";
        let progress = "❙"
        let progressBar = `[${progress.repeat(Math.round(percent))} ${empty.repeat(percent+99)}]`;

        const progressEmbed = new Discord.MessageEmbed()
            .setTitle(`Year progress bar`)
            .addFields({ name: `${yy} is ${percent.toFixed(2)}% complete.`, value: `${progressBar}`})
            .setTimestamp()
        interaction.reply({ embeds: [progressEmbed] })
    },
};

