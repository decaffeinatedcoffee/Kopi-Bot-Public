const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Throws the dice for a chance to win the bet value.')
    .addNumberOption(option =>
      option
        .setName('amount')
        .setDescription('The value you wanna bet.')
        .setMinValue(1)
        .setRequired(true)
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let u = await users.get(interaction.user.id);
    if (u) {
      u = JSON.parse(u);
      if (parseInt(u.coins) >= interaction.options.getNumber('amount')) {
        let bet = interaction.options.getNumber('amount');
        interaction.channel.send(`${interaction.user.username} throws the dice for the chance to win ${bet} coins.`)
        var dice1 = Math.round(Math.random() * (6 - 1) + 1)
        var dice2 = Math.round(Math.random() * (6 - 1) + 1)
        var dice3 = Math.round(Math.random() * (6 - 1) + 1)
        var dice4 = Math.round(Math.random() * (6 - 1) + 1)

        var opponentResult = dice1 + dice2;
        var totalplayer = dice3 + dice4;

        if (opponentResult > totalplayer) {
          interaction.channel.send(`${interaction.user.username} has ${dice3} and ${dice4}`)
          interaction.channel.send(`The opponent have ${dice1} and ${dice2}`).then(function () {
            interaction.channel.send(`${interaction.user.username} loses ${bet} coins.`)
          })
          u.coins = parseInt(u.coins) - parseInt(bet);
        } else if (opponentResult == totalplayer) {
          z.delete();
          interaction.channel.send(`We have a tie with ${dice1} and ${dice2}`)
        } else if (totalplayer > opponentResult) {
          interaction.channel.send(`${interaction.user.username} has ${dice3} and ${dice4}`)
          interaction.channel.send(`The opponent have ${dice1} and ${dice2}`).then(function () {
            interaction.channel.send(`${interaction.user.username} wins ${bet} coins.`)
          })
          u.coins = parseInt(u.coins) + parseInt(bet);
        }
        users.set(interaction.user.id, JSON.stringify(u));
        interaction.reply({ content: "This game has ended.", ephemeral: true });
      } else {
        interaction.reply({ content: "You don't have enough money for this.", ephemeral: true });
      }
    } else {
      interaction.reply({ content: "You should have an account to use the dices.", ephemeral: true });
    }
  },
};
