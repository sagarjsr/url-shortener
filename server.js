const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:Pass@123@devconnector.agdmw.mongodb.net/url_shortener?retryWrites=true&w=majority",
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on the port ${port}`));
