const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('divorce')
        .setDescription('It was not your soulmate? Then use this command.')
        .addStringOption(option =>
            option
                .setName('cause')
                .setDescription('Why do you wanna divorce this user?.')
                .setRequired(true)
                .setMaxLength(500)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        if (u) {
            u = JSON.parse(u);
            if(u.married == true){
            let u2ID = u.marryInfo.id;
            let u2 = await users.get(u2ID);
            u2 = JSON.parse(u2);
            u.married = false;
            u2.married = false;
            delete u.marryInfo;
            delete u2.marryInfo;
            users.set(interaction.user.id, JSON.stringify(u));
            users.set(u2ID, JSON.stringify(u2));
            interaction.reply({ content: `Hello <@${u2ID}>, i'm really sorry it's ending this way but <@${interaction.user.id}> is divorcing you because "${interaction.options.getString('cause')}". I hope you both can find the right ones.` })
        }else{
            interaction.reply({ content: "You are not married!", ephemeral:true })
        }
     } else {
            interaction.reply({ content: "You should have an account to use this!", ephemeral:true })
        }
    },
};
