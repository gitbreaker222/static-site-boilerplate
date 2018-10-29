const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const sass = require('metalsmith-sass')
const postcss = require('metalsmith-with-postcss')
const watch = require('metalsmith-watch');
const serve = require('metalsmith-serve');
// var permalinks  = require('metalsmith-permalinks');

const metadata = require('./src/content/metadata.json')


// inspect
var debug = require('metalsmith-debug');
var multimatch = require('multimatch');
function folderStructureToJson(opts = {}){

  return function (files, metalsmith, done){
    setImmediate(done);
    const indexPattern = /^\d*_/;
    const datePattern = /^\d\d\d\d-\d\d-\d\d_/;
    const navMenu = {
      path: '/',
      menu: [],
    };
    let menu = navMenu.menu;
    let name = '';
    let path = '/';

    Object.keys(files).sort().forEach(function(file){
      if(multimatch(file, ['**/*.md']).length) {
        debug('myplugin working on: %s', file);
        const fileObj = files[file];
        const pathSplitters = file.split('/')
        /*
        [ 'index.md' ]
        [ '01_artists', 'index.md' ]
        [ '02_albums', 'index.md' ]
        [ '04_labels', 'index.md' ]
        [ '04_releases', 'index.md' ]
        [ '04_releases',
          '2018-10-28_LOVE-MACHINE--Solar-Phallus',
          'index.md' ]
        [ '03_genres', 'index.md' ]
        [ '03_genres', '01_rock', 'index.md' ]
        [ '03_genres', '03_electro', 'index.md' ]
        [ '03_genres', 'metal', 'index.md' ]
        [ '03_genres', 'metal', 'heavy-metal', 'index.md' ]
        [ '03_genres', 'metal', 'metalcore', 'index.md' ]
        [ '03_genres', 'metal', 'more', 'index.md' ]
        [ '03_genres', 'metal', 'more', 'black-metal', 'index.md' ]
        [ '03_genres', 'metal', 'more', 'death-metal', 'index.md' ]
        */
        console.log(pathSplitters);

        if (pathSplitters.length === 1) continue

        name = pathSplitters[0]
          .replace(indexPattern, '')
          .replace(datePattern, '')
        path = '/' + pathSplitters[0]
        menu.push({
          name,
          path,
          ...fileObj,
        })

      }
    });
  };
}
// inspect end



// Build HTML / Structure
Metalsmith(__dirname)
  .source('./src/content')
  .destination('./build')
  .clean(true)
  .ignore(['metadata.json'])
  .metadata(metadata)
  .use(folderStructureToJson())
  .use(markdown())
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });



// Build CSS
// Metalsmith(__dirname)
//   .source('./src/sass')
//   .destination('./build/css')
//   .clean(false)
//   .use(sass())
//   .use(postcss({
//     pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
//     plugins: {
//       'autoprefixer': {}
//     }
//   }))
//   .use(watch({
//     paths: {
//       "${source}/**/*": true,
//     }
//   }))
//   .build(function(err, files) {
//     if (err) {
//       throw err;
//     }
//   });

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
// Metalsmith(__dirname)
//   .source('./build')
//   .use(serve())
//   .build(function(err, files) {
//     if (err) {
//       throw err;
//     }
//   });
