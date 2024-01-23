const { SlashCommandBuilder } = require('@discordjs/builders');
const { ocrSpace } = require('ocr-space-api-wrapper');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ocr')
    .setDescription('Converts text from image to text on chat.')
    .addAttachmentOption(option =>
      option
        .setName('image')
        .setDescription('The image you wanna run.')
        .setRequired(true)
    ),
  async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
    if (interaction.options.getAttachment('image').contentType.startsWith("image")) {
      let imagetext = await ocrSpace(interaction.options.getAttachment('image').url, { apiKey: process.env.OCRAPIKEY });
      if (imagetext.OCRExitCode == 1 || imagetext.OCRExitCode == 2) {
        if (imagetext.ParsedResults[0]['ParsedText']) {
          interaction.reply({ content: imagetext.ParsedResults[0]['ParsedText'], ephemeral: true });
        } else {
          interaction.reply({ content: "No text found on this image", ephemeral: true });
        }
      }
      else if (imagetext.ErrorMessage == "File failed validation. File size exceeds the maximum size limit. Maximum size limit 1024 KB") {
        interaction.reply({ content: "The maximum file size is 1MB", ephemeral: true });
      } else {
        interaction.reply({ content: "Something went wrong, but i don't know what.", ephemeral: true });
      }
    } else {
      interaction.reply({ content: "Please attach a valid image file.", ephemeral: true })
    }
  },
};