const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { success: undefined });
});

router.post("/convert-mp3", async (req, res) => {
  const videoUrl = req.body.videolink;
  
  if (!videoUrl) {
    return res.render("index", { success: false, message: "Please enter a valid URL." });
  }

  // Dummy response (Replace with actual YouTube conversion logic)
  res.render("index", { success: true, song_title: "Sample Song", song_link: "#" });
});

module.exports = router;
