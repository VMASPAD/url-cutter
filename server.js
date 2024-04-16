const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  const fullUrl = req.body.fullUrl;
  let shortUrlValue = req.body.shortUrl;

  // Verifica si se proporcionó una URL completa
  if (!fullUrl) {
    return res.status(400).json({ message: 'Por favor, ingresa una URL completa' });
  }

  // Si no se proporcionó un valor para la URL corta, genera uno aleatorio
  if (!shortUrlValue) {
    shortUrlValue = shortId.generate();
  }

  const shortUrl = new ShortUrl({
    full: fullUrl,
    short: shortUrlValue,
  });

  try {
    const savedShortUrl = await shortUrl.save();
    console.log(savedShortUrl);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al acortar la URL' });
  }
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);