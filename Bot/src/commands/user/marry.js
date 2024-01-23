const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const CryptoJS = require("crypto-js");
const fs = require("fs");
var AES = require("crypto-js/aes");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('marry')
        .setDescription('Found your soulmate? So use this command.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to get married with.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('cause')
                .setDescription('Why do you wanna marry this user?.')
                .setRequired(true)
                .setMaxLength(40)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        let u2 = await users.get(interaction.options.getUser('user').id);
        if (u) {
            if (u2) {
                u = JSON.parse(u);
                u2 = JSON.parse(u2);
                if (u.married == true) {
                    interaction.reply(`You are already married to ${u.marry.username}.`);
                } else if (u2.married == true) {
                    interaction.reply(`This user is already married to ${u2.married.username}.`);
                } else if (fs.existsSync(`./marriage_center/${interaction.user.id}plus${interaction.options.getUser('user').id}.json`)) {
                    interaction.reply({ content: "You have already asked this person, please wait at least 30 seconds.", ephemeral: true });
                }
                else {
                    u.pronouns = JSON.parse(CryptoJS.AES.decrypt(u.pronouns, process.env.SALT).toString(CryptoJS.enc.Utf8))
                    let json = { aUserID: interaction.user.id, aUserUsername: interaction.user.username, bUserID: interaction.options.getUser('user').id, bUserUsername: interaction.options.getUser('user').username, accepted: false, cause: interaction.options.getString('cause') }
                    fs.writeFile(`./marriage_center/${interaction.user.id}plus${interaction.options.getUser('user').id}.json`, JSON.stringify(json), 'utf8', function callback() { });
                    const yesOrNo = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(JSON.stringify({ aUserID: interaction.user.id, bUserID: interaction.options.getUser('user').id, agree: true, }))
                                .setLabel('Yes i do!')
                                .setStyle('SUCCESS'),
                        )
                        .addComponents(
                            new MessageButton()
                                .setCustomId(JSON.stringify({ aUserID: interaction.user.id, bUserID: interaction.options.getUser('user').id, agree: false }))
                                .setLabel("No i don't")
                                .setStyle('DANGER'),
                        );
                    interaction.reply({ content: `Hello <@${interaction.options.getUser('user').id}>, <@${interaction.user.id}> is asking you to marry ${u.pronouns[1]}, ${u.pronouns[0]} said its because "${interaction.options.getString('cause')}". will you accept?`, components: [yesOrNo] })
                    setTimeout(function () {
                        if (fs.existsSync(`./marriage_center/${interaction.user.id}plus${interaction.options.getUser('user').id}.json`)) {
                            let rawjson = fs.readFileSync(`./marriage_center/${interaction.user.id}plus${interaction.options.getUser('user').id}.json`);
                            rawjson = JSON.parse(rawjson)
                            fs.unlinkSync(`./marriage_center/${interaction.user.id}plus${interaction.options.getUser('user').id}.json`);
                            if (rawjson.accepted == false && !rawjson.denied) {
                                interaction.editReply({ content: `Hi <@${interaction.user.id}>, i'm really sorry about that, but, <@${interaction.options.getUser('user').id}> has ignored you.`, components: [] })
                            }
                        }
                    }, 30000);
                }
            } else {
                interaction.reply({ content: "The user should have an account for you to use this command", ephemeral: true });
            }
        } else {
            interaction.reply({ content: "You should have an account to use this command!", ephemeral: true });
        }
    },
};
