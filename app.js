require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routers = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const corsOptions = require('./middlewares/cors');

const {
  NODE_ENV = 'development', DB_PRODUCTION, PORT = 3001, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

const app = express();

app.use(limiter);

app.use(cors(corsOptions));

app.use(helmet());

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(routers);

mongoose.connect(NODE_ENV === 'production' ? DB_PRODUCTION : DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  family: 4,
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
