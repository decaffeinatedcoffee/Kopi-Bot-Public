const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const storeCatalog = require('../../../plugins/store/catalog.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy something from the store.')
        .addStringOption(option =>
            option
                .setName('product')
                .setDescription('The product you want to buy.')
                .setRequired(true)
                .setChoices({name:"Cookie 🍪", value:"cookie"},{name:"Apple 🍎", value:"apple"},{name:"Bread 🥖", value:"bread"},{name:"Milk 🥛", value:"milk"}, {name:"Dog food", value:"dog food"},{name:"Cat food", value:"cat food"},{name:"Fish food", value:"fish food"},{name:"Pets Health Regenerator 💊", value:"health regenerator"})
        )
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('How many of this you wanna buy?')
                .setMinValue(1)
                .setRequired(true)
        ),
        async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        const product = interaction.options.getString("product");
        const amount = interaction.options.getInteger('amount');
        let u = await users.get(interaction.user.id);
        if (u) {
            u = JSON.parse(u);
            let userMoney = u.coins;
            let found = false
            for (var i = 0; i < storeCatalog.length; i++) {
                if (storeCatalog[i].name.toLowerCase() == product.toLowerCase()) {
                    found = true;
                    if (userMoney >= (amount * storeCatalog[i].price)) {
                        let sold = false;
                        for (var x = 0; x < u.inventory.length; x++) {
                            if (u.inventory[x].name == product && sold == false) {
                                let amon = u.inventory[x].amount;
                                u.inventory[x].amount = parseInt(amon) + amount;
                                sold = true;
                            }
                        }
                        if (sold == false) {
                            u.inventory.push({"name": product.toLowerCase(), amount: amount, "icon": storeCatalog[i].icon});
                            sold = true;
                        }
                        userMoney = parseInt(userMoney) - (amount * storeCatalog[i].price);
                        u.coins = userMoney;
                        users.set(interaction.user.id, JSON.stringify(u));
                        interaction.reply(`You bought ${amount} ${product} for ${amount * storeCatalog[i].price} coins.`)
                        return;
                    } else {
                        interaction.reply("You don't have enough money to buy this.");
                    }
                }
            }
            if (found == false) {
                interaction.reply({ content: "I'm sorry, i could not find the product you are looking for, please check if you are typing it as it shows in /shop", ephemeral: true });
            }
        } else {
            interaction.reply({ content: "You should have an account to use this.", ephemeral: true });
        }
    },
};
