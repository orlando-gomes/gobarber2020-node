export default {
  jwt: {
    secret: process.env.APP_SECRET || 'defaultParaOTeste',
    expiresIn: '1d',
  },
};
