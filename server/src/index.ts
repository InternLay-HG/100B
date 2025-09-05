import { server, app } from "./socket/socket";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import config from "./config/serverConfig";
import apiRoutes from "./routes/index";
import credentials from "./middlewares/credentials";
import corsOptions from "./config/corsOptions";
import logMethods from "./middlewares/logEvents";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";
import path from "path";


const { PORT } = config; 

app.use(logMethods.logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api', apiRoutes);


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


app.use(errorHandler);

server.listen(PORT, () => {
    console.log('server started at', PORT);
});

