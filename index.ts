import express from 'express';
import morgan from 'morgan'
import { engine } from 'express-handlebars';
import { v4 as uuidv4 } from 'uuid';
import { EventSource } from 'express-ts-sse';

const port = process.env.PORT || 3000;
const app = express();
const sse = new EventSource();

// Configure renderer
app.engine('html', engine( { defaultLayout: false } ))
app.set('view engine', 'html');

// Log incoming requests
app.use(morgan('combined'));

// POST /chest
app.post('/chess', express.urlencoded( {  extended: true } ), (req, resp) => {
    const gameId = uuidv4().substring(0, 8);
    const orientation = 'white';
    resp.status(200).render('chess', { gameId, orientation });
})

// GET
app.get('/chess', (req, resp) => {
    const gameId = req.query.gameId;
    const orientation = 'black';
    resp.status(200).render('chess', { gameId, orientation });
})

app.get('/chess/stream', sse.init);

// PATCH
app.patch('/chess/:gameId', express.json(), (req, resp) => {
    const gameId = req.params.gameId;
    const move = req.body;
    console.info(move);
    sse.send({ event: gameId, data: move }); // should stringify data
    resp.status(201).json({ timestamp: new Date().getTime() })
})

// Serve files from /static
app.use(express.static(__dirname + '/static'));

app.listen(port, () => {
    console.info(`Application bound to port ${port} at ${new Date()}`);
});