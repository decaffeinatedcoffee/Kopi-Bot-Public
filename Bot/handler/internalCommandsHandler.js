const { mkdirSync } = require("fs");
const array = require("../var/arrays");
module.exports = {
    async handleInternalCommands(msg, users, guilds, hh, mm, ss, dd, mM, yy) {
        if (msg.author.id == process.env.OWNERID) {
            if (msg.content.toLowerCase() == "$btclk") {
                msg.reply(`The bot time is ${array.months[mM]} ${array.days[dd]}, ${yy} ${hh}:${mm}:${ss} (UTC-3)`);
            } else if (msg.content.toLowerCase().startsWith("$blacklist")) {
                let pos = msg.content.slice(11, 14).toLowerCase()
                let userID = msg.content.slice(15);
                if (!isNaN(userID)) {
                    let u = await users.get(userID);
                    if (u) {
                        u = JSON.parse(u);
                    } else {
                        u = { blacklisted: null }
                    }
                    if (pos == 'add') {
                        u.blacklisted = true;
                        users.set(userID, JSON.stringify(u));
                        msg.reply(`The user ${userID} was blacklisted successfully.`)
                    } else if (pos == 'rem') {
                        u.blacklisted = false;
                        users.set(userID, JSON.stringify(u));
                        msg.reply(`The user ${userID} was removed from blacklist successfully.`)
                    } else {
                        msg.reply("Invalid option at argument 1");
                    }
                }
                else {
                    msg.reply("Argument 2 can not be NaN value");
                }
            }
        }
    }
}