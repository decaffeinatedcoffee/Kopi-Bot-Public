const Discord = require("discord.js")
///////////////Lines 14 to 48 for message delete event//////////////
///////////////Lines 51 to 76 for message edit event////////////////
///////////////Lines 86 to 100 for member role remove event/////////
///////////////Lines 101 to 115 for member role add event///////////
///////////////Lines 116 to 134 for member nick edit event//////////
///////////////Lines 138 to 155 for channel create event////////////
///////////////Lines 157 to 174 for channel delete event////////////
///////////////Lines 176 to 199 for channel edit event//////////////
///////////////Lines 201 to 219 for invite create event/////////////
///////////////Lines 221 to 236 for guild new member event//////////
///////////////Lines 238 to 255 for guild member remove event///////
module.exports = {
  async logger(client, internalDB, guilds, embedColor) {

    client.on('messageDelete', async function (msg, channel) {
      let c;
      if (msg.channel.type != "DM") {
        let g = await guilds.get(msg.guild.id);
        if (g) {
          g = JSON.parse(g);
          c = client.channels.cache.get(g.logsChannel);
        }
      }
      if (c && msg.content && msg.channel.type != "DM" && msg.author.id != process.env.BOTID) {
        try {
          const embeddelete = new Discord.MessageEmbed()
            .setColor(embedColor['logs'])
            .setTitle('Message deleted from ' + msg.channel.name)
            .addFields(
              { name: 'author:', value: msg.author.tag },
              { name: 'Content:', value: msg.content },

            )
            .setTimestamp()
          c.send({ embeds: [embeddelete] })
        }
        catch {
          console.log("error")
        }
      }
    });

    client.on('messageUpdate', async function (msg, newmsg) {
      let c;
      if (msg.channel.type != "DM") {
        let g = await guilds.get(msg.guild.id);
        if (g) {
          g = JSON.parse(g);
          c = client.channels.cache.get(g.logsChannel);
        }
      }
      if (c && msg.content != newmsg.content && msg.channel.type != "DM" && msg.author.id != process.env.BOTID) {
        try {
          const embededit = new Discord.MessageEmbed()
            .setColor(embedColor['logs'])
            .setTitle('Message edited in ' + msg.channel.name + " channel")
            .setAuthor("By " + msg.author.tag, "https://cdn.discordapp.com/avatars/" + msg.author.id + "/" + msg.author.avatar + ".png")
            .addFields(
              { name: 'Old content:', value: msg.content },
              { name: 'New content:', value: newmsg.content },
            )
            .setTimestamp()
          c.send({ embeds: [embededit] })
        } catch {
          console.log("error")
        }
      }
    });

    client.on("guildMemberUpdate", async function (memberb4, memberafter) {
      let c;
      let g = await guilds.get(memberb4.guild.id);
      if (g) {
        g = JSON.parse(g);
        c = client.channels.cache.get(g.logsChannel);
      }
      if (c && memberafter.id != process.env.BOTID) {
        if (memberb4.roles.cache.size > memberafter.roles.cache.size) {
          let logs = await memberb4.guild.fetchAuditLogs({ type: 25 });
          let entry = logs.entries.first();
          const embedrole = new Discord.MessageEmbed()
            .setColor(embedColor['logs'])
            .setAuthor("By " + entry.executor.username + "#" + entry.executor.discriminator, "https://cdn.discordapp.com/avatars/" + entry.executor.id + "/" + entry.executor.avatar + ".png")
            .setTitle('Role removed from ' + memberafter.user.tag)
            .setTimestamp()
          memberb4.roles.cache.forEach(role => {
            if (!memberafter.roles.cache.has(role.id)) {
              embedrole.addField("Removed role:", role.name);
            }
          });
          c.send({ embeds: [embedrole] })
        }
        if (memberb4.roles.cache.size < memberafter.roles.cache.size) {
          let logs = await memberb4.guild.fetchAuditLogs({ type: 25 });
          let entry = logs.entries.first();
          const embedrole = new Discord.MessageEmbed()
            .setColor(embedColor['logs'])
            .setAuthor("By " + entry.executor.username + "#" + entry.executor.discriminator, "https://cdn.discordapp.com/avatars/" + entry.executor.id + "/" + entry.executor.avatar + ".png")
            .setTitle('Role added for ' + memberafter.user.tag)
            .setTimestamp()
          memberafter.roles.cache.forEach(role => {
            if (!memberb4.roles.cache.has(role.id)) {
              embedrole.addField("Added role:", role.name);
            }
          });
          c.send({ embeds: [embedrole] })
        }
        if (memberb4.nickname != memberafter.nickname) {
          let logs = await memberb4.guild.fetchAuditLogs({ type: 24 });
          let entry = logs.entries.first();
          if (!memberb4.nickname) {
            memberb4.nickname = memberafter.user.username;
          }
          if (!memberafter.nickname) {
            memberafter.nickname = memberafter.user.username;
          }
          const embednick = new Discord.MessageEmbed()
            .setColor(embedColor['logs'])
            .setAuthor("By " + entry.executor.username + "#" + entry.executor.discriminator, "https://cdn.discordapp.com/avatars/" + entry.executor.id + "/" + entry.executor.avatar + ".png")
            .setTitle('Nick changed for ' + memberafter.user.tag)
            .setTimestamp()
            .addField("Old name", memberb4.nickname)
            .addField("New name", memberafter.nickname)

          c.send({ embeds: [embednick] })
        }
      }
    });

    client.on("channelCreate", async function (channel) {
      let c;
      let g = await guilds.get(channel.guild.id);
      if (g) {
        g = JSON.parse(g);
        c = client.channels.cache.get(g.logsChannel);
      }
      let logs = await channel.guild.fetchAuditLogs({ type: 10 });
      let entry = logs.entries.first();
      if (c) {
        const embedchannel = new Discord.MessageEmbed()
          .setColor(embedColor['logs'])
          .setAuthor("By " + entry.executor.username + "#" + entry.executor.discriminator, "https://cdn.discordapp.com/avatars/" + entry.executor.id + "/" + entry.executor.avatar + ".png")
          .setTitle('Channel "' + channel.name + '" was created')
          .setTimestamp()
        c.send({ embeds: [embedchannel] })
      }
    });

    client.on("channelDelete", async function (channel) {
      let c;
      let g = await guilds.get(channel.guild.id);
      if (g) {
        g = JSON.parse(g);
        c = client.channels.cache.get(g.logsChannel);
      }
      let logs = await channel.guild.fetchAuditLogs({ type: 15 });
      let entry = logs.entries.first();
      if (c) {
        const embedchannel = new Discord.MessageEmbed()
          .setColor(embedColor['logs'])
          .setAuthor("By " + entry.executor.username + "#" + entry.executor.discriminator, "https://cdn.discordapp.com/avatars/" + entry.executor.id + "/" + entry.executor.avatar + ".png")
          .setTitle('Channel "' + channel.name + '" was deleted')
          .setTimestamp()
        c.send({ embeds: [embedchannel] })
      }
    });

    client.on("channelUpdate", async function (channel, chan) {
      let c;
      let g = await guilds.get(channel.guild.id);
      if (g) {
        g = JSON.parse(g);
        c = client.channels.cache.get(g.logsChannel);
      }
      let logs = await channel.guild.fetchAuditLogs({ type: 11 });
      let entry = logs.entries.first();
      if (c) {
        if (channel.name != chan.name) {
          const embedchannel = new Discord.MessageEmbed()
            .setColor(embedColor['logs'])
            .setAuthor("By " + entry.executor.username + "#" + entry.executor.discriminator, "https://cdn.discordapp.com/avatars/" + entry.executor.id + "/" + entry.executor.avatar + ".png")
            .setTitle('Channel "' + channel.name + '" was edited')
            .setTimestamp()
            .addFields(
              { name: 'Old name:', value: channel.name },
              { name: 'New name:', value: chan.name },
            )
          c.send({ embeds: [embedchannel] })
        }
      }
    });

    client.on('inviteCreate', async function (newInvite) {
      let c;
      let g = await guilds.get(newInvite.guild.id);
      if (g) {
        g = JSON.parse(g);
        c = client.channels.cache.get(g.logsChannel);
      }
      if (c) {
        const embedinvite = new Discord.MessageEmbed()
          .setColor(embedColor['logs'])
          .setTitle("Invite generated")
          .setAuthor("By " + newInvite.inviter.tag, "https://cdn.discordapp.com/avatars/" + newInvite.inviter.id + "/" + newInvite.inviter.avatar + ".png")
          .setTimestamp()
          .addFields(
            { name: 'Invite code', value: newInvite.code },
          )
        c.send({ embeds: [embedinvite] })
      }
    })

    client.on('guildMemberAdd', async function (member) {
      let c;
      let g = await guilds.get(member.guild.id);
      if (g) {
        g = JSON.parse(g);
        c = client.channels.cache.get(g.logsChannel);
      }
      if (c) {
        const embedjoin = new Discord.MessageEmbed()
          .setColor(embedColor['logs'])
          .setTitle("User joined")
          .setAuthor(member.user.tag + " joined the server", "https://cdn.discordapp.com/avatars/" + member.id + "/" + member.user.avatar + ".png")
          .setTimestamp()
        c.send({ embeds: [embedjoin] })
      }
    })

    client.on('guildMemberRemove', async function (member) {
      let c;
      let g = await guilds.get(member.guild.id);
      if (g) {
        g = JSON.parse(g);
        c = client.channels.cache.get(g.logsChannel);
      }
      if (c && member.id != 911314631526592544) {
        const embedleft = new Discord.MessageEmbed()
          .setColor(embedColor['logs'])
          .setTitle("User left")
          .setAuthor(member.user.tag + " left the server", "https://cdn.discordapp.com/avatars/" + member.id + "/" + member.user.avatar + ".png")
          .setTimestamp()
        c.send({ embeds: [embedleft] })
      }
    })
  }
}