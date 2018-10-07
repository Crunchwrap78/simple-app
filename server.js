import express from 'express';
import path from 'path';
import webpack from 'webpack';
import config from './webpack.config';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = express();
const expressStaticGzip = require("express-static-gzip")
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT || 3000;
app.set('port', port);

if (isDeveloping) {
    const compiler = webpack(config)
    app.use(webpackMiddleware(compiler, config.devServer));
    app.use(webpackHotMiddleware(compiler, config.devServer));
} else {
    app.use(
      expressStaticGzip("dist", {
        enableBrotli: true
      })
    );
    app.use(express.static(path.join(__dirname, 'dist')));
}

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(app.get('port'), () => {
    console.log(`listen on ${app.get('port')}`);
});