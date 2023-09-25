const corsOptions = {
  origin: [
    'https://movies-project.nomoreparties.co',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://api.movies-project.nomoreparties.co',
    'https://api.nomoreparties.co/beatfilm-movies',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};

module.exports = corsOptions;
