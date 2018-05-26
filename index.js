const Metalsmith  = require('metalsmith');
const markdown    = require('metalsmith-markdown');
const layouts     = require('metalsmith-layouts');
const discoverPartials = require('metalsmith-discover-partials')
const sass          = require('metalsmith-sass')
const postcss       = require('metalsmith-with-postcss')
// var permalinks  = require('metalsmith-permalinks');

const metadata    = require('./content/metadata.json')

// Build HTML / Structure
Metalsmith(__dirname)
  .source('./content')
  .destination('./build')
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

// Build CSS
Metalsmith(__dirname)
  .source('./src/sass')
  .destination('./build/css')
  .clean(false)
  .metadata(metadata)
  .use(sass())
  .use(postcss({
    pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
    plugins: {
      'autoprefixer': {}
    }
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });
