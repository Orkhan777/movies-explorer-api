const corsOptions = {
  origin: [
    'https://movies-project.nomoreparties.co',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://api.movie-project.nomoreparties.co',
    'https://api.movie-project.nomoreparties.co',
    'https://movies-project.nomoreparties.co',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};

module.exports = corsOptions;
