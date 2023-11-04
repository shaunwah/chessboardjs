import express from 'express';
import morgan from 'morgan'
import { engine } from 'express-handlebars';
import { v4 as uuidv4 } from 'uuid';

const port = process.env.PORT || 3000;
const app = express();

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

// Serve files from /static
app.use(express.static(__dirname + '/static'));

app.listen(port, () => {
    console.info(`Application bound to port ${port} at ${new Date()}`);
})