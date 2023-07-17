const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs'); 
var path = require('path')
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(fileUpload());

app.get('/api/images', (req, res) => {
  const imageDir = path.join(__dirname, 'images');
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error('Error reading image directory:', err);
      res.status(500).send('Server Error');
    } else {
      const images = files.map(file => {
        return {
          filename: file,
          url: `${req.protocol}://${req.get('host')}/images/${file}`
        };
      });
      res.json(images);
    }
  });
});

app.post('/api/upload', (req, res) => {
  let extName = path.extname(req.files.profileImg.name);

  if (extName == ".jpeg" || extName == ".jpg" || extName == ".png") {
    req.files.profileImg.mv(__dirname + "/images/" + uuidv4() + extName)
    res.send('OK')
  } else {
    res.status(500).send("Ext error");
  }
});

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Server is running...');
});