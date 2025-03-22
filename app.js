const express = require("express");
const serverless = require("serverless-http");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const router = express.Router();

app.set("view engine", "ejs");
app.use(express.static("public"));

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
    const fetchAPI = await fetch(
      `https://yt-search-and-download-mp3.p.rapidapi.com/mp3?url=${videolink}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.API_HOST,
        },
      }
    );

    const fetchresponse = await fetchAPI.json();

    if (fetchresponse.success) {
      return res.render("index", { success: true, song_title: fetchresponse.title, song_link: fetchresponse.download });
    } else {
      return res.render("index", { success: false, message: "Enter a valid link" });
    }
  } catch (error) {
    console.error("Error fetching API:", error);
    return res.render("index", { success: false, message: "An error occurred. Try again later." });
  }
});

// **Important: Use router for Netlify instead of app**
app.use("/.netlify/functions/api", router);

module.exports = app;
module.exports.handler = serverless(app);
