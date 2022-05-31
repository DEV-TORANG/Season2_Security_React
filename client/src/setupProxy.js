// Cross Origin Resource Sharing 방지.
// 보안 방지법 중 하나인 Proxy를 사용하는 방식.

const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
 };