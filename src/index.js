const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

const {
    getDownloadLink,
    getCourseHash,
    getCourseLink,
    addDownloadTask
} = require('./helper.js');


const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
bot.on('message', async (msg) => {
    const url = getCourseLink(msg.text)
    if (!url) return;
    try {
        const resp = await axios.get(url);
        const hash = getCourseHash(resp.data);
        if (!hash) return;
        const magnet = getDownloadLink(hash);
        await addDownloadTask(magnet, {
            ip: process.env.IP,
            port: process.env.PORT,
            temp: process.env.TEMP,
            move: process.env.MOVE,
            user: process.env.USERNAME,
            pass: Buffer.from(process.env.PASSWORD).toString('base64'),
        });
        bot.sendMessage(msg.chat.id, `Successfully added to the download queue in Download Station. ${url}`);
    } catch(err) {
        console.error(err);
        bot.sendMessage(msg.chat.id, `Failed to add to the download queue in Download Station. ${url}`);
    }
    bot.deleteMessage(msg.chat.id, msg.message_id);
});
