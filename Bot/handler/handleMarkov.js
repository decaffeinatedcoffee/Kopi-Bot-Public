const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
const Markov = require('js-markov');
module.exports = {

    async handleMarkov(msg, guilds, users) {
        if(msg.content.toLowerCase().startsWith('!mv')){
        let u = await users.get(msg.author.id);
        let g = await guilds.get(msg.guild.id);
        let s = await msg.content.slice(4);
        if(s){
        let mem = [];
        if (u) {
            u = JSON.parse(u);
            if (g) {
                g = JSON.parse(g);
                if (g.markovEnabled == true) {
                    for (var i = 0; i < g.markovDB.length; i++) {
                        mem.push(CryptoJS.AES.decrypt(g.markovDB[i], process.env.MARKOVSALT).toString(CryptoJS.enc.Utf8));
                    }
                    if (g.markovDB.length < 500) {
                        if (!mem.includes(s)) {
                            g.markovDB.push(CryptoJS.AES.encrypt(s.replace(/[&\/\\#,+(`)/$@~%.'":;*<>{}]/g, ''), process.env.MARKOVSALT).toString());
                        }
                    } else {
                        msg.channel.send("The markov function has reached the limit of 500 sentences storage and is not learning new texts.")
                    }
                    guilds.set(msg.guild.id, JSON.stringify(g));
                    var markov = new Markov();
                    markov.clearChain();
                    markov.addStates(mem);
                    markov.train();
                    let r = markov.generateRandom();
                    if (r) {
                        msg.reply(r.toString());
                    } else {
                        msg.reply("The bot is still learning words and can not generate results, please use the command again.");
                    }
                } else {
                    msg.reply({ content: "This guild has disabled this function." });
                }
            } else {
                msg.reply({ content: "This guild is not registered yet." });
            }
        } else {
            msg.reply({ content: "You should have an account to use this!"});
        }
    }else{
        msg.reply("The message is empty");
    }
}
    },
};
