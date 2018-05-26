const Metalsmith  = require('metalsmith');
const markdown    = require('metalsmith-markdown');
const layouts     = require('metalsmith-layouts');
const discoverPartials = require('metalsmith-discover-partials')
const sass          = require('metalsmith-sass')
// var permalinks  = require('metalsmith-permalinks');

const metadata    = require('./content/metadata.json')

Metalsmith(__dirname)
  .source('./content')
  .destination('./dist')
  .clean(true)
  .ignore(['metadata.json'])
  .metadata(metadata)
  .use(markdown())
  .use(discoverPartials({
    directory: './src/layouts/partials',
    pattern: /\.hbs$/
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './src/layouts',
    default: 'layout.html',
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });

// Metalsmith(__dirname)
//   .source('./src/sass')
//   .destination('./dist/css')
//   .clean(false)
//   .metadata(metadata)
//   .use(sass())
//   .build(function(err, files) {
//     if (err) { throw err; }
//   });
