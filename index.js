const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const discoverMovie = require('./discoverMovie');
const getGenreId = require('./constant');
const app = express();
app.use(bodyParser.json());


app.post('/discover-movies',(req,res) => {
    console.log('[POST] /discover-movies');
    const memory = req.body.conversation.memory;
    console.log(memory);
    const movie = memory.movie;
    const tv = memory.tv;
    return;
    // Check for the presence of entities movie or tv
    // If both are present, we prioritize movie

    const kind = movie ? 'movie' : 'tv';

    const genre = memory.genre;
    console.log(genre);
    const genreId = getGenreId(genre);

    const language = memory.language;
    const nationality = memory.nationality;

    // Similar to movie and tv, we prioritize language over nationality
    const isoCode = language
        ? language.short.toLowerCase()
        : nationality.short.toLowerCase();
 
        return discoverMovie(kind, genreId, isoCode)
        .then((carouselle) => res.json({
         replies: carouselle,
        }))
        .catch((err) => console.error('movieApi::discoverMovie error: ', err));

});

app.post('/errors',(req,res) =>{
    console.error(req.body);
    res.sendStatus(200);
});

app.get('/',(req,res) => {
    res.sendStatus(200);
});

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`));