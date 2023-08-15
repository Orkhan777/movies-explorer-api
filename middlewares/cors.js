const corsOptions = {
  origin: [
    'http://movies-project.nomoreparties.co',
    'http://localhost:3000',
    'localhost:3000',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};

module.exports = corsOptions;
