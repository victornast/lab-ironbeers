const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(__dirname + '/views/partials');

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index', { activeHome: true, pageTitle: 'Home' });
});

app.get('/:pathName', (req, res) => {
  const name = req.params.pathName;
  switch (name) {
    case 'beers':
      punkAPI
        .getBeers()
        .then(beersFromApi => {
          console.log('Beers from the database: ', beersFromApi);
          res.render('beers', {
            beersFromApi,
            activeBeers: true,
            pageTitle: 'Beer Catalog'
          });
        })
        .catch(error => console.log(error));
      break;
    case 'random-beer':
      punkAPI
        .getRandom()
        .then(responseFromAPI => {
          console.log('Beer from database:', responseFromAPI);
          res.render('random-beer', {
            randomBeer: responseFromAPI[0],
            activeRandomBeers: true,
            pageTitle: 'Random Beer'
          });
        })
        .catch(error => console.log(error));
      break;
  }
});

app.get('/beers/:beerId', (req, res) => {
  const beerId = req.params.beerId;
  punkAPI
    .getBeers()
    .then(beersFromApi => {
      console.log('Beers from the database: ', beersFromApi);
      res.render('random-beer', {
        randomBeer: beersFromApi[beerId - 1],
        pageTitle: beersFromApi[beerId - 1].name
      });
    })
    .catch(error => console.log(error));
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
