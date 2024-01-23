const { SlashCommandBuilder } = require('@discordjs/builders');
const os = require("os");
var cp = require('child_process').spawn;
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Displays useful data about the bot.'),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    var totalHeap = (process.memoryUsage().heapTotal / (1000 * 1000)).toFixed(2);
    var usedHeap = (process.memoryUsage().heapUsed / (1000 * 1000)).toFixed(2);
    var totalRss = (process.memoryUsage().rss / (1000 * 1000)).toFixed(2);
    var cpuTemp;
    var temp = cp('cat', ['/sys/class/hwmon/hwmon0/temp2_input']);
    temp.stdout.on('data', function(data) {
    cpuTemp = parseInt(data);
    var arch = process.arch;
    var totalram = (os.totalmem() / (1000 * 1000)).toFixed(2);
    var cores = os.cpus().length;
    var cmodel = os.cpus()[0].model;
    var cspeed = os.cpus()[0].speed;
    var platf = os.platform();
    var osys = os.version()
    var crat = Date.parse(client.user.createdAt) / 1000;
    var usedram = ((os.totalmem() - os.freemem()) / (1000 * 1000)).toFixed(2);
    const totaluptime = startTimestamp - new Date().valueOf();
    const totalsecs = Math.floor((totaluptime % (1000 * 60)) / 1000);
    const totalmins = Math.floor((totaluptime % (1000 * 60 * 60)) / (1000 * 60));
    const totalhours = Math.floor((totaluptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const totaldays = Math.floor(totaluptime / (1000 * 60 * 60 * 24));
    const botinfoEmbed = new Discord.MessageEmbed()
      .setColor(embedColor['info'])
      .setDescription("🤖 Heres the bot info")
      .addFields(
        { name: "Created at", value: `<t:${(crat).toString()}>` },
        { name: "RSS", value: totalRss + "MB" },
        { name: "Heap", value: usedHeap + "MB/" + totalHeap + "MB used" },
        { name: "RAM", value: (usedram / 1000).toFixed(2) + "GB/" + (totalram / 1000).toFixed(2) + "GB used" },
        { name: "CPU cores", value: cores.toString() },
        { name: "Model", value: cmodel.toString() },
        { name: "Clock", value: cspeed.toString() + "MHz" },
        { name: "Temperature", value: Math.round(cpuTemp / 1000) + "°C" },
        { name: "Arch", value: arch },
        { name: "OS", value: osys },
        { name: "Platform", value: platf },
        { name: "Uptime", value: Math.abs(totaldays + 1) + " days, " + Math.abs(totalhours + 1) + " hours, " + Math.abs(totalmins + 1) + " minutes, " + Math.abs(totalsecs + 1) + " seconds" },
      )
      .setTimestamp()
    interaction.reply({ embeds: [botinfoEmbed] });
     });
  },
};
