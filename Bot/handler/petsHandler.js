module.exports = {
    async handlePets(client, users) {
        client.users.cache.forEach(async user => {
            let u = await users.get(user.id);
            if (u) {
                u = JSON.parse(u);
                if (u.pets != null) {
                    let lastMeal = {};
                    let lastSleep = {};
                    let petType = u.pets.type;
                    var currentTime = new Date().getTime();
                    var lastm = new Date(u.pets.lastfeed).getTime();
                    var lasts = new Date(u.pets.lastsleep).getTime();
                    var r = currentTime - lastm;
                    var s = currentTime - lasts;
                    lastMeal.h = Math.floor((r % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    lastMeal.m = Math.floor((r % (1000 * 60 * 60)) / (1000 * 60));
                    lastMeal.s = Math.floor((r % (1000 * 60)) / 1000);
                    lastSleep.h = Math.floor((s % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    lastSleep.m = Math.floor((s % (1000 * 60 * 60)) / (1000 * 60));
                    lastSleep.s = Math.floor((s % (1000 * 60)) / 1000);
                    if (petType == "dog") {
                        if (lastMeal.h >= 1 && u.pets != null) {
                            if (u.pets.hungry < 92) {
                                u.pets.hungry = u.pets.hungry + 8
                            } else {
                                if (u.pets.life > 7) {
                                    u.pets.hungry = 100;
                                    u.pets.life = u.pets.life - 7;
                                } else {
                                    petDie("hunger");
                                }
                            }
                        }
                        if (lastSleep.h >= 1 && u.pets != null) {
                            if (u.pets.sleep < 90) {
                                u.pets.sleep = u.pets.sleep + 10
                            } else {
                                if (u.pets.life > 2) {
                                    u.pets.sleep = 100;
                                    u.pets.life = u.pets.life - 2;
                                } else {
                                    petDie("exhaustion");
                                }
                            }
                        }
                    } 
                    if (petType == "cat") {
                        if (lastMeal.h >= 1 && u.pets != null) {
                            if (u.pets.hungry < 87) {
                                u.pets.hungry = u.pets.hungry + 13
                            } else {
                                if (u.pets.life > 2) {
                                    u.pets.hungry = 100;
                                    u.pets.life = u.pets.life - 2;
                                } else {
                                    petDie("hunger");
                                }
                            }
                        }
                        if (lastSleep.h >= 1 && u.pets != null) {
                            if (u.pets.sleep < 88) {
                                u.pets.sleep = u.pets.sleep + 12
                            } else {
                                if (u.pets.life > 2) {
                                    u.pets.sleep = 100;
                                    u.pets.life = u.pets.life - 2;
                                } else {
                                    petDie("exhaustion");
                                }
                            }
                        }
                    }
                    if (petType == "fish") {
                        if (lastMeal.h >= 1 && u.pets != null) {
                            if (u.pets.hungry < 93) {
                                u.pets.hungry = u.pets.hungry + 6
                            } else {
                                if (u.pets.life > 1) {
                                    u.pets.hungry = 100;
                                    u.pets.life = u.pets.life - 1;
                                } else {
                                    petDie("hunger");
                                }
                            }
                        }
                        if (lastSleep.h >= 1 && u.pets != null) {
                            if (u.pets.sleep < 92) {
                                u.pets.sleep = u.pets.sleep + 8
                            } else {
                                if (u.pets.life > 10) {
                                    u.pets.sleep = 100;
                                    u.pets.life = u.pets.life - 10;
                                } else {
                                    petDie("exhaustion");
                                }
                            }
                        }
                    }
                    function petDie(cause) {
                        try {
                            client.channels.cache.get(u.pets.channelID).send(`Hello, <@${user.id}>, i have bad news for you, i know it's sad but your pet ${u.pets.name} just died of ${cause}.`);
                        } catch {
                            user.send(`Hello, i have bad news for you, i know it's sad but your pet ${u.pets.name} just died of ${cause}.`);
                        }
                        u.pets = null
                    }
                    users.set(user.id, JSON.stringify(u));
                }
            }
        });

    }
}