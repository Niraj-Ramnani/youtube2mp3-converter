const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine" , "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({
     extended: true
}))

app.use(express.json());

app.get("/" , (req,res) =>{
     res.render("index")
})

app.post("/convert-mp3" , async (req,res) =>{
    const videolink = req.body.videolink;
    console.log(videolink)
    if(
     videolink === undefined ||
     videolink === "" ||
     videolink === null 
    ){
     return res.render("index" , {success : false, message : "Please enter a video link "});
    }else{
          const fetchAPI = await fetch(`https://yt-search-and-download-mp3.p.rapidapi.com/mp3?url=${videolink}` , {
             "method"   : "GET",
             "headers" : {
                'x-rapidapi-key': process.env.API_KEY,
    'x-rapidapi-host': process.env.API_HOST
             }
          });
        const fetchresponse = await fetchAPI.json();
        if(fetchresponse.success === true){
          return res.render("index" ,{success : true , song_title: fetchresponse.title , song_link : fetchresponse.download});
          console.log(fetchresponse);
        }
        else 
         return res.render("index" , {success : false , message : "Enter a valid link "})
    }
})

const { createServer } = require('@vercel/node');

module.exports = createServer(app);
