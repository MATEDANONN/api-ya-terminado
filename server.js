import express from 'express';
import passport from 'passport';
import db from './db.js';
import path from 'path';
import fs from 'fs';
import Authorization from "./auth.js";
import searchMovies from "./axios.js";

const __dirname = fs.realpathSync('.');

var isAuth = false;

function isAuthenticated() {
  if (isAuth) {
    return true;
  }
  else return false;
}

////////////////////////////////////////////////////////////////////////////////
class DictionaryBackendServer {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      const filePath = path.join(__dirname, 'public', req.url);
      const extname = path.extname(filePath).toLowerCase();
      const allowedExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif']; // Add more extensions if needed

      if (allowedExtensions.includes(extname)) {
        res.sendFile(filePath);
      } else {
        next();
      }
    });
    app.use(express.urlencoded({ extended: false }));
    const authorization = new Authorization(app);

    app.get('/lookup/:word', this._doLookup);
    app.post('/save/', this._doSave);
    app.get('/login/', this._login);
    app.get('/', this._goHome);
    app.post('/registro/', this._doSignup.bind(this));

    // aca empieza el cambio
    app.get('/auth/google/', passport.authenticate('google', {
      scope: ['email', 'profile']
    }));

    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

    app.post("/logout", (req, res) => {
      req.logOut(err => console.log(err));
      res.redirect("/login");
    });

    app.get('/movie/:name', this.movieSearch);

    app.post('/checkLogin/', this.loginSubroutine.bind(this));

    app.get('/notLogged', this.notLogged);

    app.get('/register', this.register);

    // Start server
    app.listen(3000, () => console.log('Listening on port 3000'));
  }

  async _login(req, res) {
    res.sendFile(path.join(__dirname, "public/login.html"));
  }

  async _goHome(req, res) {
    if (isAuthenticated()) {
      res.sendFile(path.join(__dirname, "public/iniciado.html"));
    } else res.redirect("/login");
  }

  async _doLookup(req, res) {
    const routeParams = req.params;
    const word = routeParams.word;
    const query = { word: word.toLowerCase() };
    const collection = db.collection("dict");
    const stored = await collection.findOne(query);
    const response = {
      word: word,
      definition: stored ? stored.definition : ''
    };
    res.json(response);
  }

  async _doSave(req, res) {
    const query = { word: req.body.word.toLowerCase() };
    const update = { $set: { definition: req.body.definition } };
    const params = { upsert: true };
    const collection = db.collection("dict");
    await collection.updateOne(query, update, params);
    res.json({ success: true });
  }

  //Metodo para perisitir el usuario en mongo
  async _doSignup(req, res) {
    console.log(req.body);
    const collection = db.collection('usuarios');
    await collection.insertOne(req.body);
    isAuth = true;
    res.json({ success: true });
  }

  async movieSearch(req, res) {
    console.log(`Searching for movie ${req.params.name}`);
    const routeParams = req.params;
    const name = routeParams.name;
    try {
      const result = await searchMovies(name);
      console.log(result);
      res.json(result);
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({ error: 'An error occurred while searching movies' });
    }
  }

  async loginSubroutine(req, res) {
    const { email, password } = req.body;

    // Perform authentication logic here, such as querying the MongoDB collection
    const collection = db.collection('usuarios');
    const user = await collection.findOne({ email, password });

    if (user) {
      console.log("User found");
      isAuth = true;
      // Authentication successful
      res.status(200).redirect("/"); // Redirect to the home page or authenticated page
    } else {
      // Authentication failed
      console.log("User not found");
      res.status(401).send('Incorrect credentials');
    }
  }

  async notLogged(req, res) {
    res.sendFile(path.join(__dirname, "public/home.html"));
  }

  async register(req, res) {
    res.sendFile(path.join(__dirname, "public/registrate.html"));
  }
}

new DictionaryBackendServer();
