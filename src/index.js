const express = require("express");
const path = require("path");
const collection = require("./config");
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.static(__dirname + '../public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use('/api', express.static(path.join(__dirname, 'api')));

let existingHtml = ""

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/api/weather", (req, res)=>{
    res.render("../api/index", {existingHtml : existingHtml})
})

app.get("/api/urban-dictionary", (req, res)=>{
    res.render("../api/urban")
})

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    try {
        const existingUser = await collection.findOne({ name: data.name });

        if (existingUser) {
            res.send('User already exists. Please choose a different username.');
        } else {
            await collection.create(data);
            res.send('User registered successfully.');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('An error occurred during signup.');
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });

        if (!check) {
            res.send("User name not found");
        } else if (check.password !== req.body.password) {
            res.send("Incorrect password");
        } else {
            res.render("home");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred during login.');
    }
});
app.post("/search", async (req, res) => {
    const city = req.body.city;
    const apiKey = '394f7ad19bb5c5525c4ddb18324358d7';
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=394f7ad19bb5c5525c4ddb18324358d7`
        );
            console.log(response);
        const weatherData = response.data;
        const temperature = weatherData.main.temp;
        const feelsLike = weatherData.main.feels_like;
        const weatherIcon = weatherData.weather[0].icon;
        
        const additionalContent = {city: city, temperature: temperature, feelsLike:feelsLike, weatherIcon:weatherIcon}

        existingHtml = additionalContent;
        res.redirect('/api/weather')
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data");
    }
});
app.post("/urban-dictionary", async (req, res) => {
    const term = req.body.term;
  
    try {
      const response = await axios.request({
        method: "GET",
        url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
        params: { term: term },
        headers: {
          "X-RapidAPI-Key": "b7a46591c7msh9fd0404fd28ff29p1a4c3ejsn4be6a293c2f2",
          "X-RapidAPI-Host": "mashape-community-urban-dictionary.p.rapidapi.com",
        },
      });
  
      const definitions = response.data.list;
      res.json({ definitions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching Urban Dictionary data" });
    }
  });
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
