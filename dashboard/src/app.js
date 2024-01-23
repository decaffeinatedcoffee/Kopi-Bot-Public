var express = require('express');
var app = express();
var cors = require('cors');
let process = require('process');
require('dotenv').config();
app.use(express.json());
app.use(cors());
let path = require('path');
var serveIndex = require('serve-index');
app.set("view engine", "ejs");
app.use('/images', express.static(__dirname + '../../imageAsset'), serveIndex(__dirname + '../../imageAsset'));
app.use('/scripts', express.static(__dirname + '../../scripts'), serveIndex(__dirname + '../../scripts'));
const http = require('http');
const server = http.createServer(app);
const Keyv = require('keyv');
const fs = require('fs');
const fetch = require('node-fetch');
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
const users = new Keyv(process.env.USERS);
const guilds = new Keyv(process.env.GUILDS);
const internal = new Keyv(process.env.INTERNAL);
users.on('error', err => console.error('Users database connection error:', err));
guilds.on('error', err => console.error('Guilds database connection error:', err));
internal.on('error', err => console.error('Internal database connection error:', err));


app.get("/", async function (req, res) {
  let i = await internal.get('botStats');
  let svr = 0;
  let usr = 0;
  if (i) {
    i = JSON.parse(i);
    svr = i.guilds;
    usr = i.users
  }
  res.render('index', { servers: svr, users: usr })
})

app.get('/profile', async ({ query }, res) => {
   if(query.error){
   res.redirect("/");
  }else{
  const { code } = query;
  if (code) {
    const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.BOTID,
        client_secret: process.env.SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `http://192.168.0.11:3001/profile`,
        scope: 'identify guilds',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const oauthData = await oauthResult.json();
    const accessToken = oauthData.access_token;
    const tokenType = 'Bearer';
    fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    })
      .then(result => result.json())
      .then(response => {
        fetch('https://discord.com/api/users/@me/guilds', {
          headers: {
            authorization: `${tokenType} ${accessToken}`,
          },
        })
          .then(result => result.json())
          .then(guildsresponse => {
            (async () => {
              const { username, discriminator, id, avatar } = response;
              let u = await users.get(id)
              let xpInfo = [];
              let warns = [];
              let user = [];
              let guildsa = [];
              if (u) {
                u = JSON.parse(u);


                
                for (var i = 0; i < guildsresponse.length; i++) {
                  guildsa.push({ guildID: guildsresponse[i].id, guildName: guildsresponse[i].name, icon: guildsresponse[i].icon });
                    for (var x = 0; x < u.xp.length; x++) {
                      if (u.xp[x].id == guildsresponse[i].id) {
                        xpInfo.push({ guild: guildsresponse[i].name, guildID: guildsresponse[i].id, icon: guildsresponse[i].icon, xp: u.xp[x].xp });
                      }
                }
              }

                for (var h = 0; h < u.warns; h++) {
                  warns.push(u.warnData[h])
                }
                let bday;
                if (u.bday) {
                  bday = CryptoJS.AES.decrypt(u.bday, process.env.SALT).toString(CryptoJS.enc.Utf8)
                } else {
                  bday = "Unset";
                }
                let pronouns = CryptoJS.AES.decrypt(u.pronouns, process.env.SALT).toString(CryptoJS.enc.Utf8)
                user.push({ username: username, id: id, avatar: avatar, tag: discriminator, bday: bday, pronouns: JSON.parse(pronouns), coins: u.coins, married: u.married, pets: u.pets, inventory: u.inventory, marryinfo: u.marryInfo, warns: u.warns })
                res.render('profile', { user: JSON.stringify(user), warns: JSON.stringify(warns), xp: JSON.stringify(xpInfo), guilds: JSON.stringify(guildsa) });
              } else {
                res.render('err', {});
              }
            })();
          })
      })
      .catch(console.error);
  }
}
});

app.get("*", function(req,res){
    res.status(404).sendFile(path.resolve(`${__dirname}../../views/404.html`))
    res.status(502).sendFile(path.resolve(`${__dirname}../../views/502.html`))
})

server.listen(process.env.PORT || 3001, () => {
    console.log("Listening Ports")
})
