const axios = require('axios');

const getCourseLink =  (text)  => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(regex);
    if (urls) {
        return urls[0];
    }
    return null;
 };

 const getCourseHash = (html) => {
    const regex = /[a-zA-Z0-9]{40}/;
    const result = html.match(regex);
    if (result) {
        return result[0];
    }
    return null;
 }


 const getDownloadLink = (hash)  => {
    return `magnet:?xt=urn:btih:${hash}&tr=udp%3a%2f%2ftracker.torrent.eu.org%3a451%2fannounce&tr=udp%3a%2f%2ftracker.tiny-vps.com%3a6969%2fannounce&tr=http%3a%2f%2ftracker.foreverpirates.co%3a80%2fannounce&tr=udp%3a%2f%2ftracker.cyberia.is%3a6969%2fannounce&tr=udp%3a%2f%2fexodus.desync.com%3a6969%2fannounce&tr=udp%3a%2f%2fexplodie.org%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce&tr=udp%3a%2f%2f9.rarbg.to%3a2780%2fannounce&tr=udp%3a%2f%2ftracker.internetwarriors.net%3a1337%2fannounce&tr=udp%3a%2f%2fipv4.tracker.harry.lu%3a80%2fannounce&tr=udp%3a%2f%2fopen.stealth.si%3a80%2fannounce&tr=udp%3a%2f%2f9.rarbg.to%3a2900%2fannounce&tr=udp%3a%2f%2f9.rarbg.me%3a2720%2fannounce&tr=udp%3a%2f%2fopentor.org%3a2710%2fannounce`
 }

const addDownloadTask = async (url, config) => {
    const {
        ip,
        port,
        user,
        pass,
        temp,
        move,
    } = config;
    const loginResponse = await axios.request({
        method: 'POST',
        url: `http://${ip}:${port}/downloadstation/V4/Misc/Login`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {user,pass, credentials: 'include'}
    });
    if (!loginResponse.data.sid) {
        throw new Error('Failed to login to your QNAP NAS.' + JSON.stringify(response.data));
    }
    const response = await axios.request({
        method: 'POST',
        url: `http://${ip}:${port}/downloadstation/V4/Task/AddUrl`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data : {
            sid : loginResponse.data.sid,
            temp,
            move,
            url
        },
    });
    if (response.data.error) {
        throw new Error('Failed to download your link.' + JSON.stringify(response.data));
    }
}

module.exports = {
    getDownloadLink,
    getCourseHash,
    getCourseLink,
    addDownloadTask,
}