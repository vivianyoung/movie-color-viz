const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
require('dotenv').config();

// set up port
const port = process.env.PORT || 3000;

const app = express();
const server = app.listen(port, () => {
    console.log(`Web server up on port ${port}`);
});

// view engine
app.use(express.static(path.join(__dirname, "../public")));

app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout:false}));
app.set('view engine', 'hbs');

app.engine('html', require('ejs').renderFile);

// middleware
const middleware = require('../middleware/middleware.js')
app.use(express.static(__dirname + '../public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('home', {});
})

app.post('/', async function (req, res){
  console.log(req.body);
  let data;
  let text;
  let num = 5;

  try {
    switch(req.body.viztype) {
      case 'movie':
        let recData = await middleware.getRecommendedMovies(req.body.textinput, num);
        data = recData;
        text = "similar movies:";
        break;
      case 'producer':
        let producerMovieData = await middleware.getPersonMovies(req.body.textinput, 'producer', num);
        data = producerMovieData;
        text = "top five movies:";
        console.log('producer data:', producerMovieData);
        break;
      case 'actor':
        let actorMovieData = await middleware.getPersonMovies(req.body.textinput, 'actor', num);
        data = actorMovieData;
        text = "top five movies:";
        console.log('actor data:', actorMovieData);
        break;
    }
  } catch (e) {
    res.status(404).send();
  }

  // res.render('home', {data: JSON.strigify(data)});

  let movieOne = data[0];
  let movieTwo = data[1];
  let movieThree = data[2];
  let movieFour = data[3];
  let movieFive = data[4];

  res.render('home', {
    text: text,
    movie1: movieOne,
    movie2: movieTwo,
    movie3: movieThree,
    movie4: movieFour,
    movie5: movieFive,
  });

});
