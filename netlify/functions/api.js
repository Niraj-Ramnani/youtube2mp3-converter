const express = require("express");
const serverless = require("serverless-http");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

const app = express();
const router = express.Router();

// Set correct paths for views and static files
app.set("views", path.join(__dirname, "views")); // ✅ Fix for Netlify Functions
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../../public"))); // ✅ Adjusted path
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get("/", (req, res) => {
    res.render("index");
});

router.post("/convert-mp3", async (req, res) => {
    const videolink = req.body.videolink;
    if (!videolink) {
        return res.render("index", { success: false, message: "Please enter a video link" });
    }

    try {
        const fetchAPI = await fetch(`https://yt-search-and-download-mp3.p.rapidapi.com/mp3?url=${videolink}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();
        if (fetchResponse.success) {
            return res.render("index", { success: true, song_title: fetchResponse.title, song_link: fetchResponse.download });
        } else {
            return res.render("index", { success: false, message: "Enter a valid link" });
        }
    } catch (error) {
        console.error(error);
        return res.render("index", { success: false, message: "Error processing the request" });
    }
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
