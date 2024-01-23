const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const e = require('express');
const catalog = require('../../../plugins/store/catalog.json')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('givepet')
    .setDescription('Give food or medications to your pet.')
    .addStringOption(option =>
      option
        .setName('what')
        .setDescription('What do you wanna give to your pet?')
        .setRequired(true)
        .setChoices({ name: "Dog food", value: "dog food" }, { name: "Cat food", value: "cat food" }, { name: "Fish food", value: "fish food" }, { name: "Milk", value: "milk" }, { name: "Apple", value: "apple" }, { name: "Health regenerator", value: "health regenerator" })
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    let u = await users.get(interaction.user.id);
    let userHas = false;
    if (u) {
      u = JSON.parse(u);
      if (u.pets == null) {
        interaction.reply({ content: "You do not have a pet.", ephemeral: true })
      } else {
        for (var i = 0; i < u.inventory.length; i++) {
          if (u.inventory[i].name.toLowerCase() == interaction.options.getString('what').toLowerCase()) {
            if (u.inventory[i].amount > 0) {
              userHas = true;
              u.inventory[i].amount = parseInt(u.inventory[i].amount) - 1;
              if (u.pets.eats.includes(interaction.options.getString('what').toLowerCase())) {
                for (var i = 0; i < catalog.length; i++) {
                  if (catalog[i].name.toLowerCase() == interaction.options.getString('what').toLowerCase()) {
                    if (catalog[i].id == 8) {
                      interaction.reply(`${u.pets.name} had a ${catalog[i].name} and is now with 100% health.`)
                      u.pets.life = 100;
                    }
                    else if (catalog[i].drinkable == true && parseInt(u.pets.hungry) >= 65) {
                      interaction.reply(`${u.pets.name} Just drank ${catalog[i].name} and is now happy.`)
                      u.pets.hungry = 0;
                      u.pets.lastfeed = Date.now();
                    } else if (catalog[i].drinkable == false && parseInt(u.pets.hungry) >= 65) {
                      interaction.reply(`${u.pets.name} Just ate ${catalog[i].name} and is now happy.`)
                      u.pets.hungry = 0;
                      u.pets.lastfeed = Date.now();
                    } else {
                      interaction.reply({ content: `${u.pets.name} are not hungry now. (Pets can eat with 65% or more hunger)`, ephemeral: true })
                    }
                    users.set(interaction.user.id, JSON.stringify(u));
                    return;
                  }
                }
              } else {
                interaction.reply({ content: "Your pet can not eat this. Check info about what your pet can eat using /animalinfo", ephemeral: true });
              }
              return;
            }
          }
        }
        if (userHas == false) {
          interaction.reply({ content: "You do not have this in your inventory.", ephemeral: true });
        }
      }
    } else {
      interaction.reply({ content: "You should have an account to use this.", ephemeral: true })
    }

  },
};
