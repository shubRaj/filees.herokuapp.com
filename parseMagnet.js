const WebTorrent = require('webtorrent');
const parseTorrent = require("parse-torrent");
function parseMagnet(magnet) {
    return new Promise((resolve, reject) => {
        let client = new WebTorrent();
        client.add(magnet, {  maxConns:10,destroyStoreOnDestroy: true, skipVerify: true,}, function (torrent) {
            let files = [];
            let { infoHash: hash } = parseTorrent(magnet);
            torrent.files.forEach(function (file) {
                filename = file.path //+ "~tc/" + file.name; //sharing from temporary cache
                files.push(filename)
            });
            client.destroy((error) => {
                resolve({ files, hash }) //either case resolve 
            });
        });
        client.on("error", (err) => {
            client.destroy((error) => {
                reject(new Error("Invalid Torrent Identifier")) //ignore 
            });
        });

    }
    );
}
module.exports = parseMagnet;