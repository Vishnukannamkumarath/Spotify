const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const song=require('./models/songModel');
require('dotenv').config();
const app=express();
app.disable("etag");
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(cors());
app.use(express.json());
const port=process.env.PORT||3000;
mongoose.connect(process.env.URI).then(()=>console.log('MongoDB connected'))
.catch((error)=>console.log(error));


app.get('/songs',async(req,res)=>{
    try{

      const songs = await song.find();

      const updatedSongs = songs.map(song => {
      const CoverUrl = song.cover; 
      const SongUrl=song.url;
      const Covermatch = CoverUrl?.match(/(?:d=|\/d\/)([a-zA-Z0-9_-]+)/);
      const SongMatch = SongUrl?.match(/(?:d=|\/d\/)([a-zA-Z0-9_-]+)/);
     
      const CoverfileId = Covermatch ? Covermatch[1] : null;
      const SongfileId=SongMatch ?SongMatch[1]:null;
      
      const coverUrl = CoverfileId
        ? `https://drive.google.com/uc?export=view&id=${CoverfileId}`
        : CoverUrl;

      const songUrl = SongfileId
        ? `https://drive.google.com/uc?export=view&id=${SongfileId}`
        : SongUrl;

      return { ...song._doc, cover: coverUrl,url:songUrl };
    });
    res.json(updatedSongs);

    }catch(error){
        console.log(error);
        res.status(500).send('server error');
    }
})


app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})