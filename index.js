require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const originalUrl = [];
const shortUrl= [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:shorturl', function(req, res) {
  const foundIndex = req.params.shorturl;
  if((shortUrl.length-1)<foundIndex){
    return res.json({
      error:"No short URL found for the given input"
    })
  }
  return res.redirect(originalUrl[foundIndex]);
});


app.post('/api/shorturl',(req,res)=>{
  const url = req.body.url;
  const foundIndex = originalUrl.indexOf(url);

  if(!url.includes("https://") && !url.includes("http://")){
    return res.json({
      error:"Invalid URL"
    })
  }

  if(foundIndex < 0){
    originalUrl.push(url);
    shortUrl.push(shortUrl.length);
    return res.json({
      original_url : url , 
      short_url : shortUrl.length-1
    })
  }

  return res.json({
    original_url:url,
    short_url:shortUrl.length-1
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
