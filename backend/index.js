require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require("socket.io");
const router = require('./router/index');
const errorMiddleware = require('./middleware/error-middleware');



const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);


const server = http.createServer(app, {
    cors: {
        origin: "*"
    }
});



const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
});



const start = async () => {
    try {
        server.listen(PORT, () => console.log(`server is running on ${PORT} port`));
    } catch (error) {
        console.log(error)
    }
};

start();