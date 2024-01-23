module.exports = {

    async handleAvatar(client, dd, mM, yy) {
        let yCount = new Date(yy, 1, 29).getDate() === 29;
        if (dd == 14 && mM == 2) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/valentines.png`)
        } else if (dd == 1 && mM == 4) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/afools.png`)
        } else if (yCount == false && mM == 9 && dd == 13) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/programmers.png`)
        } else if (yCount == true && mM == 9 && dd == 12) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/programmers.png`)
        } else if (mM == 10 && dd == 29) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/bday.png`)
        } else if (mM == 10 && dd == 31) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/halloween.png`)
        } else if (mM == 12 && dd >= 2 && dd <= 30) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/xmas.png`)
        } else if (mM == 12 && dd == 31) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/ny.png`)
        } else if (mM == 1 && dd == 1) {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/ny.png`)
        } else {
            client.user.setAvatar(`${__dirname} ../../imageAsset/avatars/default.png`);
        }
    },
};
