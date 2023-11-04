// Access <body>
const body = document.querySelector('body');

// Access the data attribute to retrieve gameId and orientation
const gameId = body.dataset.gameid;
const orientation = body.dataset.orientation;

console.info(`gameId: ${gameId}, orientation: ${orientation}`)

const onDrop = (src, dst, piece) => {
    console.info(`src=${src}, dst=${dst}, piece=${piece}`)

    const move = { src, dst, piece };

    fetch(`/chess/${gameId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(move)
    }
    )
    .then(result => console.info(result))
    .catch(err => console.error(err));
}

const config = {
    draggable: true,
    position: 'start',
    orientation,
    onDrop
}

// Create an instance of chess
const chess = Chessboard('chess', config);

// Create an SSE connection
const sse = new EventSource('/chess/stream');
sse.addEventListener(gameId, msg => {
    // console.info('sse msg: ', msg);
    const { src, dst, piece } = JSON.parse(msg.data);
    // console.info(`src=${src},dst=${dst},piece=${piece}`)
    chess.move(`${src}-${dst}`);
})