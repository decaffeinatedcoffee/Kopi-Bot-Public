let xpSet = new Set();
module.exports = {

    async handleXP(msg, users) {
        if (msg.channel.type != "DM") {
            let foundGuild = false;
            var XPbefore;
            var xpAfter;
            if (xpSet.has(msg.guild.id + msg.author.id) == false && msg.author.id != process.env.BOTID && msg.channel.type != "DM") {
                let u = await users.get(msg.author.id);
                if (u) {
                    u = JSON.parse(u);
                    for (var i = 0; i < u.xp.length; i++) {
                        if (u.xp[i].id == msg.guild.id) {
                            foundGuild = true;
                            userXP = u.xp[i].xp;
                            if(!userXP){
                                userXP = 0;
                            }
                            XPbefore = u.xp[i].xp;
                            if(!XPbefore){
                                XPbefore = 0;
                            }
                            userXP = parseInt(userXP) + 30;
                            xpAfter = userXP;
                            u.xp[i].xp = userXP;
                            users.set(msg.author.id, JSON.stringify(u));
                        }
                    }
                    if (foundGuild == false) {
                        u.xp.push({ id: msg.guild.id, xp: 30 });
                        XPbefore = 0;
                        xpAfter = 30;
                        users.set(msg.author.id, JSON.stringify(u));
                        console.log("[SYS] Created XP file for an user.");
                    }
                    if (Math.trunc(parseInt(XPbefore) / 1000) < Math.trunc(parseInt(xpAfter) / 1000)) {
                        msg.author.send('✅ Congrats ' + msg.author.username + '! you just advanced to level ' + Math.trunc(parseInt(xpAfter) / 1000) + ' with ' + xpAfter + ' XP on ' + msg.guild.name + ' server!')
                            .catch(err => {
                                msg.channel.send('✅ Congrats <@' + msg.author.id + '>! you just advanced to level ' + Math.trunc(parseInt(xpAfter) / 1000) + ' with ' + xpAfter + ' XP on this server!');
                            })
                    }
                    xpSet.add(msg.guild.id + msg.author.id);
                    setTimeout(() => xpSet.delete(msg.guild.id + msg.author.id), 60000);
                }
            }
        }
    }
};