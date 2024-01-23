const fs = require('fs')
module.exports ={
    async handleMarry(interaction, users){
        let json = JSON.parse(interaction.customId);
		if(interaction.user.id != json.bUserID){
			interaction.reply({content:"You can not reply to this!", ephemeral:true})
		}else{
			if(json.agree == true){
            let u = await users.get(json.aUserID);
			let u2 = await users.get(interaction.user.id);
			u = JSON.parse(u);
			u2 = JSON.parse(u2);
			if (fs.existsSync(`./marriage_center/${json.aUserID}plus${interaction.user.id}.json`)) {
				let rawjson = fs.readFileSync(`./marriage_center/${json.aUserID}plus${interaction.user.id}.json`);
				rawjson = JSON.parse(rawjson)
				rawjson.accepted = true;
				fs.writeFile(`./marriage_center/${json.aUserID}plus${interaction.user.id}.json`, JSON.stringify(rawjson), 'utf8', function callback() { });
			interaction.reply(`Hey <@${json.aUserID}>, <@${interaction.user.id}> has accepted you! You are now married, Congrats!`);
			u.married = true;
			u2.married = true;
			u.marryInfo = {username:rawjson.bUserUsername, id: rawjson.bUserID, cause: rawjson.cause, at:Date.now(), atGuild: interaction.guild.id, atChannel: interaction.channel.id}
			u2.marryInfo = {username:rawjson.aUserUsername, id: rawjson.aUserID, cause: rawjson.cause, at:Date.now(), atGuild: interaction.guild.id, atChannel: interaction.channel.id}
			users.set(json.aUserID, JSON.stringify(u));
			users.set(interaction.user.id, JSON.stringify(u2));
		}
			}else{
				if (fs.existsSync(`./marriage_center/${json.aUserID}plus${interaction.user.id}.json`)) {
					let rawjson = fs.readFileSync(`./marriage_center/${json.aUserID}plus${interaction.user.id}.json`);
					rawjson = JSON.parse(rawjson)
					rawjson.accepted = false;
					rawjson.denied = true;
					fs.writeFile(`./marriage_center/${json.aUserID}plus${interaction.user.id}.json`, JSON.stringify(rawjson), 'utf8', function callback() { });
				    interaction.reply(`I'm so sorry <@${json.aUserID}>, but <@${interaction.user.id}> has denied you. Maybe it was not the time for this to happen, stay strong.`);
			}
			}
		}
    }
    }