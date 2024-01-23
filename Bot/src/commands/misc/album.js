const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const Jimp = require("jimp");
const path = require("path")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('albumcover')
        .setDescription('Turns a image into an album cover.')
        .addAttachmentOption(option =>
          option
            .setName('image')
            .setDescription('The image you wanna use.')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
              .setName('text')
              .setDescription('The text you wanna use. (Dont use big texts for best results.)')
              .setRequired(true)
      )
      .addStringOption(option =>
        option
            .setName('textcolor')
            .setDescription('The text color you wanna use.')
            .setRequired(true)
            .setChoices({name:"Red", value:"#FF0000"},{name:"Green", value:"#00FF00"},{name:"Blue", value:"#0000FF"},{name:"White", value:"#FFFFFF"},{name:"Black", value:"#000000"},{name:"Orange", value:"#FFA500"},{name:"Purple", value:"#51087E"},)
    )
        .addIntegerOption(option =>
            option
                .setName('explicit')
                .setDescription('Should the bot add explicit content tag?')
                .setRequired(true)
             .setChoices({name:"Yes", value:1}, {name:"No", value:2})
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
       let explicit = interaction.options.getInteger('explicit');
       let aimage = interaction.options.getAttachment('image');
       let text = interaction.options.getString('text');
       let color = interaction.options.getString('textcolor');
       if(!text){
       text = "";
       }
       if(aimage.contentType.startsWith("image") && !aimage.contentType.toLowerCase().startsWith("image/webp")){
       if(explicit == 1){
        explicit = true;
       }else{
        explicit = false;
       }
       overlay()
       async function overlay() {
interaction.reply("I’m generating please wait.")
         const image = await Jimp.read(aimage.url);
         const explicitImg = await Jimp.read(path.resolve(__dirname + "../../../../imageAsset/albumCommand/explicit.png"))
         const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
         image.resize(281,272);
         var h = image.bitmap.height;
         var w = image.bitmap.width;
         image.greyscale();
         explicitImg.resize(w/3, h/5)
         let textImage = new Jimp(1000,1000, 0x0, (err, textImage) => {  
          if (err) throw err;
      })
         textImage.print(font, 0, h/5, {
          text: text,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        }, w, h);
        textImage.color([{ apply: 'xor', params: [color] }]); 
        textImage.invert();
        image.blit(textImage, 0, 0)
         if(explicit == true){
         image.blit(explicitImg, w/1.55, h/1.3);
         }
         await image.writeAsync(path.resolve(`${__dirname}../../../../imageAsset/albumCommand/${interaction.guild.id}.png`)).then(() => {
           interaction.editReply({content:null,files: [path.resolve(`${__dirname}../../../../imageAsset/albumCommand/${interaction.guild.id}.png`)] })
         })
       }



       }else{
        interaction.reply({content:"Please upload a valid image file.", ephemeral:true});
       }
    },
};
