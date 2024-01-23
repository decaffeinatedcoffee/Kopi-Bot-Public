const Discord = require("discord.js");
module.exports = {
    async handleWordFilter(msg, guilds, client) {
        if(msg.channel.type != 'DM'){
       let g = await guilds.get(msg.guild.id)
       if(g){
       g = JSON.parse(g);
      for(var i = 0; i < g.wordfilter.length; i++){
        if(msg.content.toLowerCase().includes(g.wordfilter[i])){
            msg.delete();
            msg.author.send("HEY! this word is not allowed in this guild.").catch(function(){
                console.log("Error while sending a word filter warn DM.")
            })
            const filterEmbed = new Discord.MessageEmbed()
            .setTitle("Filter Word Found")
            .setAuthor(`By ${msg.author.tag}`,"https://cdn.discordapp.com/avatars/" + msg.author.id + "/" + msg.author.avatar + ".png")
            .addFields({name:"Word:", value: `${g.wordfilter[i]}`})
            .addFields({name:"Message (1023 chars max)", value:`${msg.content.slice(0, 1023)}`})
            .setTimestamp();
            if(g.logsChannel){
              client.channels.cache.get(g.logsChannel).send({embeds:[filterEmbed]}).catch(function(){
                console.log("Error while sending a Word Filter warn to guild logs channel.")
              })
            }
            return;
        }
      }
       }
    }
}
}