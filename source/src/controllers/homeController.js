const express = require("express");
const router = express.Router();
const Playlist = require("../models/model.js").Playlist;
const Song = require("../models/model.js").Song;
router.get("/", (req, res) => {
    res.render('home')
});

router.get("/playlist/:id", async (req, res) => {
    let id = req.params.id;
    let playlist = await Playlist.findById(id)
        .populate("author", {
            name: 1,
            content: 1,
            birthday: 1,
            image: 1,
            artist: 1,
        }).populate("songs")
    let songimg
    let songid
    
    console.log(playlist.songs)
    await playlist.songs.forEach(e=>{
        if(e.image){
            songimg = e.image
            songid = e._id
        }
    })
    
    let rend = {
        title: "Graceful",
        page: 1,
        size: 10,
        PlaylistManage: true,
        id: id,
        name: playlist.title,
        view: playlist.view,
        desc: playlist.desc
    };
    if(songid){
        let song = await Song.findOne({_id:songid}).populate("artist")
        rend = {...rend, squareImg: song.artist[0].image.squareImg}
    }
    if(songimg)
        rend = {...rend, bannerImg: songimg}
    res.render("user/detailplaylist",rend)   
});

module.exports = router;