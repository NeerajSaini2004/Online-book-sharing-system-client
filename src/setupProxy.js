const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://online-book-sharing-system-backend.onrender.com',
      changeOrigin: true,
    })
  );
};
