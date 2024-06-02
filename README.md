# URL Shortener

This is a simple URL shortener application built with Node.js, Express, and MongoDB. It allows users to create short URLs for long URLs, and tracks the number of clicks on each short URL.

## Features

- Create short URLs for long URLs
- Customize the short URL name (optional)
- Redirects to the original long URL when visiting the short URL
- Tracks the number of clicks for each short URL

## Prerequisites

- Node.js (v12 or higher)
- MongoDB (local or remote instance)

## Installation

1. Clone the repository:

```
git clone https://github.com/your-repo/url-shortener.git
```

2. Navigate to the project directory:

```
cd url-shortener
```

3. Install the dependencies:

```
npm install
```

4. Start the application:

```
npm start
```

The application should now be running at `http://localhost:5000`.

## Usage

1. Visit `http://localhost:5000` in your web browser.
2. Enter the long URL you want to shorten in the "Full URL" field.
3. Optionally, enter a custom name for your short URL in the "Short URL Name" field.
4. Click the "Shorten URL" button.
5. The application will generate a short URL and display it in the table below.
6. To access the original long URL, visit the short URL in your web browser.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS (Embedded JavaScript Templates)
- Tailwind CSS

## Directory Structure

```
url-shortener/
├── models/
│   └── shortUrl.js
├── views/
│   └── index.ejs
├── index.js
├── package.json
└── README.md
```

- `models/shortUrl.js`: Mongoose schema and model for the short URL data.
- `views/index.ejs`: EJS template for the main application page.
- `index.js`: Entry point of the application, containing the Express server and route handlers.
- `package.json`: Project dependencies and scripts.
- `README.md`: This file.

Sure, here's an explanation of the `index.js` file in English for the README:

The `index.js` file is the entry point of the application and contains the Express server configuration and route handlers.

```javascript
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
```

Here, the required dependencies are imported: `express` for creating the server, `mongoose` for interacting with MongoDB, and the `ShortUrl` model from the `./models/shortUrl.js` file.

```javascript
mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})
```

This line establishes a connection to the MongoDB database named `urlShortener` running locally.

```javascript
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
```

These lines configure the Express application to use EJS (Embedded JavaScript) as the view engine and enable URL-encoded request body parsing.

```javascript
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})
```

This route handler handles GET requests to the root URL (`/`). It fetches all existing short URLs from the database using the `ShortUrl.find()` method and renders the `index.ejs` template, passing the `shortUrls` data to the template.

```javascript
app.post('/shortUrls', async (req, res) => {
  // ... (code omitted for brevity)
})
```

This route handler handles POST requests to the `/shortUrls` URL. It is responsible for creating new short URLs based on the submitted long URL and (optionally) a custom short URL name. The created short URL is saved to the database, and the user is redirected to the root URL (`/`).

```javascript
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})
```

This route handler handles GET requests to the short URL path (`/:shortUrl`). It finds the corresponding short URL document in the database based on the `shortUrl` parameter in the URL. If the short URL is not found, it returns a 404 status code. Otherwise, it increments the `clicks` count for the short URL, saves the updated document, and redirects the user to the original long URL (`shortUrl.full`).

```javascript
app.listen(process.env.PORT || 5000);
```

Finally, this line starts the Express server and listens for incoming requests on the specified port (`process.env.PORT` or 5000 if the environment variable is not set).