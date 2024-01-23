const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('deletebirthday')
          .setDescription('Removes your birth date.'),
     async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
          let u = await users.get(interaction.user.id);
          if (u) {
               u = JSON.parse(u);
               if (u.bday != null) {
                    u.bday = null;
                    users.set(interaction.user.id, JSON.stringify(u));
                    interaction.reply("Your birth date was deleted.")
               } else {
                    interaction.reply("You don't have setted your bday already.")
               }
          }
          else {
               interaction.reply({ content: "You should have an account to use this.", ephemeral: true })
          }
     },
};
