const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const discoverPartials = require('metalsmith-discover-partials')
const sass = require('metalsmith-sass')
const postcss = require('metalsmith-with-postcss')
const watch = require('metalsmith-watch');
const serve = require('metalsmith-serve');
// var permalinks  = require('metalsmith-permalinks');

const metadata = require('./src/content/metadata.json')

// Build HTML / Structure
Metalsmith(__dirname)
  .source('./src/content')
  .destination('./build')
  .clean(true)
  .ignore(['metadata.json'])
  .metadata(metadata)
  .use(markdown())
  .use(discoverPartials({
    directory: './src/layouts/partials',
    pattern: /\.hbs/
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './src/layouts',
    default: 'layout.hbs',
  }))
  .use(watch({
    paths: {
      "./src/layouts/**/*": '**/*',
    }
  }))
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });



// Build CSS
Metalsmith(__dirname)
  .source('./src/sass')
  .destination('./build/css')
  .clean(false)
  .use(sass())
  .use(postcss({
    pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
    plugins: {
      'autoprefixer': {}
    }
  }))
  .use(watch({
    paths: {
      "${source}/**/*": true,
    }
  }))
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });

// Copy assets
Metalsmith(__dirname)
  .source('./src/assets')
  .destination('./build/assets')
  .clean(false)
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });

// Start server
Metalsmith(__dirname)
  .source('./build')
  .use(serve())
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });
