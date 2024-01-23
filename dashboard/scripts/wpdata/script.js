    let petName;
    if (user[0].pets != null) {
        petName = `${user[0].pets.name} ${user[0].pets.icon}`;
        document.getElementById("petbday").innerText = new Date(user[0].pets.bday).toDateString();
        document.getElementById("petmeal").innerText = new Date(user[0].pets.lastfeed).toLocaleDateString();
        document.getElementById("petlsleep").innerText = new Date(user[0].pets.lastsleep).toLocaleDateString();
        document.getElementById("pethealth").innerText = `${user[0].pets.life}%`;
        document.getElementById("pethunger").innerText = `${user[0].pets.hungry}%`;
        document.getElementById("petsleep").innerText = `${user[0].pets.sleep}%`;
        document.getElementById("petData").style.display = "block";
        document.getElementById("pethealthrange").value = user[0].pets.life
        document.getElementById("pethungerrange").value = user[0].pets.hungry
        document.getElementById("petsleeprange").value = user[0].pets.sleep
    } else {
        petName = "You do not have a pet!"
        document.getElementById("petData").style.display = "none";
    }
    if (user[0].married == true) {
        document.getElementById("mrid").innerText = "Yes";
        document.getElementById("mrname").innerText = user[0].marryinfo.username;
        document.getElementById("mrsince").innerText = new Date(user[0].marryinfo.at).toDateString();
        document.getElementById("mrcause").innerText = `${user[0].marryinfo.cause.slice(0, 40)}`;
    } else {
        document.getElementById("mrid").innerText = "No";
        document.getElementById("marryData").style.display = "none";
    }
    document.getElementById("userAvatar").src = `https://cdn.discordapp.com/avatars/${user[0].id}/${user[0].avatar}`
    document.getElementById("wlc").innerText = `Hello, ${user[0].username}!`
    document.getElementById("bdate").innerText = user[0].bday;
    document.getElementById("pronouns").innerText = `${user[0].pronouns[0]}/${user[0].pronouns[1]}/${user[0].pronouns[2]}`
    document.getElementById("petName").innerText = petName;
    document.getElementById("bal").innerText = `${user[0].coins} coins`;
    document.getElementById("totalWarns").innerText = user[0].warns;
    for (var i = 0; i < user[0].inventory.length; i++) {
        if (user[0].inventory[i].amount > 0) {
            var element = document.createElement("div");
            var par = document.createElement("p");
            par.innerText = `${user[0].inventory[i].icon} ${user[0].inventory[i].name} - ${user[0].inventory[i].amount}`
            par.setAttribute("onclick", "userInfo(" + (parseInt(i)) + ")");
            element.appendChild(par);
            document.getElementById('invDiv').appendChild(element);
        }
    }

    for (var i = 0; i < warns.length; i++) {
        var element = document.createElement("div");
        var img = document.createElement("img")
        var wr = document.createElement("span");
        var cs = document.createElement("span");
        var at = document.createElement("span");
        var pf = document.createElement("a");
        if (warns[i].guildIcon) {
            img.src = `https://cdn.discordapp.com/icons/${warns[i].atGuild}/${warns[i].guildIcon}`;
        } else {
            img.src = "/images/wpdata/noimage.png";
        }
        wr.innerText = warns[i].guildName;
        wr.classList.add("wsName")
        cs.innerText = "Click to read more."
        cs.classList.add("wsCause")
        at.innerText = new Date(warns[i].in).toLocaleDateString();
        at.classList.add("wsDate")
        if (warns[i].proofs) {
            pf.innerText = "Proofs";
            pf.href = warns[i].proofs;
            pf.setAttribute("target", "_blank")
            pf.classList.add("wsProofs")
        } else {
            at.style.marginLeft = "264px";
        }
        element.appendChild(img);
        element.appendChild(wr);
        element.appendChild(cs);
        element.appendChild(pf);
        element.appendChild(at);
        element.classList.add("warn")
        element.setAttribute("onclick", "displayWarnInfo(" + (parseInt(i)) + ")");
        document.getElementById('warnsInfo').appendChild(element);
    }

    for (var i = 0; i < xp.length; i++) {
        var element = document.createElement("div");
        var img = document.createElement("img")
        var val = document.createElement("p");
        if (xp[i].icon) {
            img.src = `https://cdn.discordapp.com/icons/${xp[i].guildID}/${xp[i].icon}`;
        } else {
            img.src = "/images/wpdata/noimage.png";
        }
        val.innerText = `${xp[i].guild} - ${xp[i].xp}XP`;
        element.appendChild(img);
        element.appendChild(val);
        element.classList.add("xpInfo")
        document.getElementById('exp').appendChild(element);
    }

    function displayWarnInfo(w) {
        document.getElementById('warnData').style.display = 'block';
        if (warns[w].guildIcon) {
            document.getElementById("wdImg").src = `https://cdn.discordapp.com/icons/${warns[w].guildID}/${warns[w].guildIcon}`
        } else {
            document.getElementById("wdImg").src = "/images/wpdata/noimage.png"
        }
        document.getElementById("wdGuild").innerText = `Guild: ${warns[w].guildName}`;
        document.getElementById("wdDate").innerText = `Date: ${new Date(warns[w].in).toLocaleDateString()}`
        document.getElementById("wdMod").innerText = `Mod: ${warns[w].author}`
        document.getElementById("wdDesc").innerText = warns[w].cause
        if (warns[w].proofs) {
            document.getElementById("wdProof").innerText = "here";
            document.getElementById("wdProof").href = warns[w].proofs
        } else {
            document.getElementById("wdProof").innerText = "no proofs";
            document.getElementById("wdProof").href = "#"
        }
    }

    function goBack() {
        document.getElementById("personal").style.display = "none";
        document.getElementById("pets").style.display = "none";
        document.getElementById("inv").style.display = "none";
        document.getElementById("marriage").style.display = "none";
        document.getElementById("warns").style.display = "none";
        document.getElementById("xp").style.display = "none";
        document.getElementById("back").style.display = "none";
        document.getElementById("home").style.display = "block";
    }

    function goPersonal() {
        document.getElementById("personal").style.display = "block";
        document.getElementById("pets").style.display = "none";
        document.getElementById("inv").style.display = "none";
        document.getElementById("marriage").style.display = "none";
        document.getElementById("warns").style.display = "none";
        document.getElementById("xp").style.display = "none";
        document.getElementById("back").style.display = "block";
        document.getElementById("home").style.display = "none";
    }
    function goPets() {
        document.getElementById("personal").style.display = "none";
        document.getElementById("pets").style.display = "block";
        document.getElementById("inv").style.display = "none";
        document.getElementById("marriage").style.display = "none";
        document.getElementById("warns").style.display = "none";
        document.getElementById("xp").style.display = "none";
        document.getElementById("back").style.display = "block";
        document.getElementById("home").style.display = "none";
    }
    function goInv() {
        document.getElementById("personal").style.display = "none";
        document.getElementById("pets").style.display = "none";
        document.getElementById("inv").style.display = "block";
        document.getElementById("marriage").style.display = "none";
        document.getElementById("warns").style.display = "none";
        document.getElementById("xp").style.display = "none";
        document.getElementById("back").style.display = "block";
        document.getElementById("home").style.display = "none";
    }
    function goMarry() {
        document.getElementById("personal").style.display = "none";
        document.getElementById("pets").style.display = "none";
        document.getElementById("inv").style.display = "none";
        document.getElementById("marriage").style.display = "block";
        document.getElementById("warns").style.display = "none";
        document.getElementById("xp").style.display = "none";
        document.getElementById("back").style.display = "block";
        document.getElementById("home").style.display = "none";
    }
    function goWarns() {
        document.getElementById("personal").style.display = "none";
        document.getElementById("pets").style.display = "none";
        document.getElementById("inv").style.display = "none";
        document.getElementById("marriage").style.display = "none";
        document.getElementById("warns").style.display = "block";
        document.getElementById("xp").style.display = "none";
        document.getElementById("back").style.display = "block";
        document.getElementById("home").style.display = "none";
    }
    function goXP() {
        document.getElementById("personal").style.display = "none";
        document.getElementById("pets").style.display = "none";
        document.getElementById("inv").style.display = "none";
        document.getElementById("marriage").style.display = "none";
        document.getElementById("warns").style.display = "none";
        document.getElementById("xp").style.display = "block";
        document.getElementById("back").style.display = "block";
        document.getElementById("home").style.display = "none";
    }
