module.exports = {

    async handlePresence(client, dd, mM, yy) {
        let yCount = new Date(yy, 1, 29).getDate() === 29;
        var cr = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })).getTime();
        var end = new Date(`Dec 24, ${yy} 23:59:59`).getTime();
        var rm = end - cr;
        var ds = Math.floor(rm / (1000 * 60 * 60 * 24));
        var hs = Math.floor((rm % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var ms = Math.floor((rm % (1000 * 60 * 60)) / (1000 * 60));
        var ss = Math.floor((rm % (1000 * 60)) / 1000);
        let xcounter
        if (ds > 1) {
            xcounter = `${ds} days`
        } else if (ds == 1) {
            xcounter = `${ds} day`
        } else if (ds == 0) {
            if (hs > 0) {
                if (hs > 1) {
                    xcounter = `${hs} hours`
                } else {
                    xcounter = `${hs} hour`
                }
            } else if (ms > 0) {
                if (ms > 1) {
                    xcounter = `${ms} minutes`
                } else {
                    xcounter = `${ms} minute`
                }
            } else if (ss >= 0) {
                xcounter = `${ss} seconds`
            }
        }
        if (dd == 14 && mM == 2) {
            client.user.setActivity("💕 Happy Valentine's day!", { type: "PLAYING" })
        } else if (dd == 1 && mM == 4) {
            client.user.setActivity("I'm a human! jk lol, april fools!", { type: "PLAYING" })
        } else if (yCount == false && mM == 9 && dd == 13) {
            client.user.setActivity('</> Happy programmers day!', { type: "LISTENING" })
        } else if (yCount == true && mM == 9 && dd == 12) {
            client.user.setActivity('</> Happy programmers day!', { type: "LISTENING" })
        } else if (mM == 10 && dd == 29) {
            client.user.setActivity("🎂 Today is my bday!", { type: "STREAMING" })
        } else if (mM == 10 && dd == 31) {
            client.user.setActivity("👻 Trick or treat", { type: "PLAYING" })
        } else if (mM == 12 && dd >= 2 && dd <= 24) {
            client.user.setActivity(`${xcounter} to christmas!`, { type: "WATCHING" })
        } else if (mM == 12 && dd == 25) {
            client.user.setActivity(`🎄 Merry christmas!`, { type: "PLAYING" })
        } else if (mM == 12 && dd == 31) {
            client.user.setActivity(`${parseInt(yy) + 1} is almost here!`, { type: "PLAYING" })
        } else if (mM == 1 && dd == 1) {
            client.user.setActivity("🎆 Happy new year!", { type: "PLAYING" })
        } else {
            client.user.setActivity("Use / to see the commands", { type: "PLAYING" })
        }
    },
};
