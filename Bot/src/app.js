const Discord = require("discord.js");
let process = require('process');
const { load } = require(__dirname + '../../plugins/loader.js');
const { logger } = require(__dirname + '../../plugins/logger.js');
const { handleXP } = require(__dirname + '../../handler/xphandler.js');
const { handleMarry } = require(__dirname + '../../handler/marryHandler.js');
const { handlePets } = require(__dirname + '../../handler/petsHandler.js');
const { handleInternalCommands } = require(__dirname + '../../handler/internalCommandsHandler.js');
const { handleWordFilter} = require(__dirname + '../../handler/wordFilter.js');
const { handleMarkov } = require(__dirname + '../../handler/handleMarkov.js');
const { handleAvatar } = require(__dirname + '../../handler/avatarsHandler.js');
const { handlePresence } = require(__dirname + '../../handler/presencesHandler.js');
const path = require('path');
const arrays = require('../var/arrays');
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_TYPING", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MEMBERS", "GUILD_INVITES"], partials: ["CHANNEL", "SEND_TTS_MESSAGES"] });
const Keyv = require('keyv');
const users = new Keyv(process.env.USERS);
const guilds = new Keyv(process.env.GUILDS);
const internalDB = new Keyv(process.env.INTERNAL);
users.on('error', err => console.error('Keyv users db connection error:', err));
guilds.on('error', err => console.error('Keyv guilds db connection error:', err));
internalDB.on('error', err => console.error("Keyv internal database connection error", err));
let startTimestamp;
let hh, mm, ss, dd, mM, yy;
 
load(client);
client.on("ready", async function () {
	console.log("[SYS] The bot was connected.")
	updatePresence();
	updateTimers();
	triggerPets();
	function triggerPets(){
	handlePets(client,users);
	setTimeout(triggerPets,3600000);
	}
  
	handleAvatar(client, dd,mM, yy);
	handlePresence(client, dd,mM, yy);
	internalDB.set("botStats", JSON.stringify({users:client.users.cache.filter(user => !user.bot).size, guilds:client.guilds.cache.size}))
	startTimestamp = Date.now();
	if (fs.existsSync('Playlist.json')) {
		fs.unlinkSync('Playlist.json');
	}

	fs.readdir(`${__dirname}../marriage_center/'`, function(err, filenames) {
		filenames.forEach(function(fn){
		  if(fn){
			fs.unlinkSync(`${__dirname}../marriage_center/'${fn}`);  
		}
		})
		})



	logger(client, internalDB, guilds, arrays.embedColor);
})
client.on("interactionCreate", async function (interaction) {
	if (interaction.isButton()) {
		handleMarry(interaction, users);
	}
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`Command  ${interaction.commandName} was not found.`);
		return;
	}
	if (interaction.channel.type != "DM") {
		let u = await users.get(interaction.user.id);
		if (u) {
			u = JSON.parse(u);
		} else {
			u = { blacklisted: false }
		}
		if (u.blacklisted == true) {
			interaction.reply("You are blacklisted and can not use the bot commands!");
		} else {
			try {
				await command.execute(interaction, client, arrays.embedColor, users, guilds, arrays.months, arrays.days, startTimestamp);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'Oof my brain could not handle this command now ):', ephemeral: true });
			}
		}
	} else {
		interaction.reply({ content: "You can't use commands on DM.", ephemeral: true })
	}
});

function updatePresence(){
	handlePresence(client, dd,mM, yy);
	setTimeout(updatePresence,5000);
}
let dataUpdated = false;
function updateTimers() {
	let datebase = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
	const getdate = new Date(datebase);
	hh = getdate.getHours();
	mm = getdate.getMinutes();
	ss = getdate.getSeconds();
	dd = getdate.getDate();
	mM = getdate.getMonth() + 1;
	yy = getdate.getFullYear();
	if(parseInt(hh) == 0 && parseInt(mm) == 0 && dataUpdated == false){
		handleAvatar(client, dd,mM, yy);
		internalDB.set("botStats", JSON.stringify({users:client.users.cache.filter(user => !user.bot).size, guilds:client.guilds.cache.size}));
		dataUpdated = true;
	}
	if(parseInt(hh) == 0 && parseInt(mm) == 1 && dataUpdated == true){
	    dataUpdated = false;
	}
	
	if (hh < 10) {
		hh = "0" + hh
	}
	if (mm < 10) {
		mm = "0" + mm
	}
	if (ss < 10) {
		ss = "0" + ss
	}
	setTimeout(updateTimers, 1000);
}

client.on("messageCreate", async function (msg) {
	handleXP(msg, users);
	handleInternalCommands(msg, users, guilds, hh,mm,ss,dd,mM,yy);
	handleWordFilter(msg, guilds, client)
	handleMarkov(msg,guilds,users);
})


client.login(process.env.DISC);


