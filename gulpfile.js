/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
******************************************************/


/******************************************************
 * DEPENDENCIES  
******************************************************/
var gulp = require('gulp'),
  path = require('path'),
  browserSync = require('browser-sync').create(),
  argv = require('minimist')(process.argv.slice(2));

//read all paths from our namespaced config file
var config = require('./patternlab-config.json'),
  patternlab = require('patternlab-node')(config);

var babel = require("gulp-babel");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
// var livereload = require('gulp-livereload');

var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var size = require('gulp-size'); 
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sassLint = require('gulp-sass-lint');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gzip = require('gulp-gzip');
var middleware  = require('connect-gzip-static');



/******************************************************
 * UTILITY FUNCTIONS
******************************************************/
function resolvePath(pathInput) {
  return path.resolve(pathInput).replace(/\\/g,"/");
}

var onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};

/******************************************************
 * UTILITY TASKS 
******************************************************/
gulp.task('sass-lint', function(done) {
  gulp.src('**/*.scss', {cwd: resolvePath(paths().source.css)})
    .pipe(sassLint({
      options: {
        formatter: 'stylish',
        'merge-default-rules': false
      },
      // files: {ignore: '**/*.scss'},
      rules: {
        'no-ids': 1,
        'no-mergeable-selectors': 0
      },
      configFile: '.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
    done();
});

/******************************************************
 * COPY TASKS - stream assets from source to destination
******************************************************/
// JS copy
gulp.task('pl-copy:js', function(){
  return gulp.src('**/*.js', {cwd: resolvePath(paths().source.js)} )
    .pipe(gulp.dest(resolvePath(paths().public.js)));
});

// JS copy FOR PRODUCTION BUILD 
gulp.task('pl-copy:prodjs', function(){
  return gulp.src('**/*.js', {cwd: resolvePath(paths().source.prodjs)} )
    .pipe(gulp.dest(resolvePath(paths().public.prodjs)));
});

// Images copy
gulp.task('pl-copy:img', function(){
  return gulp.src('**/*.*',{cwd: resolvePath(paths().source.images)} )
    .pipe(gulp.dest(resolvePath(paths().public.images)));
});

// Favicon copy
gulp.task('pl-copy:favicon', function(){
  return gulp.src('favicon.ico', {cwd: resolvePath(paths().source.root)} )
    .pipe(gulp.dest(resolvePath(paths().public.root)));
});

// Fonts copy
gulp.task('pl-copy:font', function(){
  return gulp.src('*', {cwd: resolvePath(paths().source.fonts)})
    .pipe(gulp.dest(resolvePath(paths().public.fonts)));
});

// CSS Copy
gulp.task('pl-copy:css', function(){
  return gulp.src(resolvePath(paths().source.css) + '/*.gz')
    .pipe(gulp.dest(resolvePath(paths().public.css)))
    .pipe(browserSync.stream());
});

// Styleguide Copy everything but css
gulp.task('pl-copy:styleguide', function(){
  return gulp.src(resolvePath(paths().source.styleguide) + '/**/!(*.css)')
    .pipe(gulp.dest(resolvePath(paths().public.root)))
    .pipe(browserSync.stream());
});

// Styleguide Copy and flatten css
gulp.task('pl-copy:styleguide-css', function(){
  return gulp.src(resolvePath(paths().source.styleguide) + '/**/*.css')
    .pipe(gulp.dest(function(file){
      //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
      file.path = path.join(file.base, path.basename(file.path));
      return resolvePath(path.join(paths().public.styleguide, '/css'));
    }))
    .pipe(browserSync.stream());
});


/******************************************************
 * PATTERN LAB CONFIGURATION FUNCTIONS - API for core library
******************************************************/
function paths() {
  return config.paths;
}

function getConfiguredCleanOption() {
  return config.cleanPublic;
}

function build(done) {
  patternlab.build(done, getConfiguredCleanOption());
}

/******************************************************
 * TASK FUNCTION DEFINITIONS
******************************************************/
function getSupportedTemplateExtensions() {
  var engines = require('./node_modules/patternlab-node/core/lib/pattern_engines');
  return engines.getSupportedFileExtensions();
}
function getTemplateWatches() {
  return getSupportedTemplateExtensions().map(function (dotExtension) {
    return resolvePath(paths().source.patterns) + '/**/*' + dotExtension;
  });
}

function reload() {
  browserSync.reload();
}

function reloadCSS() {
  browserSync.reload('*.css');
}

// SASS BUILD PROCESS.
function devStyles() {
    return gulp
    .src('*.scss', {cwd: resolvePath(paths().source.scss)})
    .pipe(plumber({errorHandler: onError})) // Mina Markham
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))    
    .pipe(autoprefixer(config.styles.autoprefixer))
    .pipe(sourcemaps.write())
    .pipe(size({ gzip: true, showFiles: true })) // Mina Markham
    // .pipe(gzip({ append: false })) // make gzip not change extension
    .pipe(gzip())
    .pipe(gulp.dest(resolvePath(paths().source.css)));
}

// PRODUCTION SASS BUILD PROCESS.
function prodStyles() {    
    return gulp
    .src('*.scss', {cwd: resolvePath(paths().source.scss)})
    .pipe(plumber({errorHandler: onError})) // Mina Markham
    .pipe(sass().on('error', sass.logError))    
    .pipe(autoprefixer(config.styles.autoprefixer))
    .pipe(cleanCSS({debug: true}, function(details) {
      console.log(details.name + ': ' + details.stats.originalSize);
      console.log(details.name + ': ' + details.stats.minifiedSize);
    }))
    .pipe(minifyCss())
    .pipe(size({ gzip: true, showFiles: true })) // Mina Markham
    .pipe(gulp.dest(resolvePath(paths().source.css)));
}

// BUILD PROCESS FOR TRANSPILING ES2015 JS 
function devScripts () {
    return gulp
    .src('**/*.js', {cwd: resolvePath(paths().source.srcjs)})
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(resolvePath(paths().source.js)));
}

// PRODUCTION BUILD PROCESS FOR TRANSPILING ES2015 JS
function prodScripts () {
    return gulp
    .src('**/*.js', {cwd: resolvePath(paths().source.srcjs)})
    .pipe(babel())
    .pipe(concat(config.scripts.bundle))
    .pipe(uglify())
    .pipe(gulp.dest(resolvePath(paths().source.prodjs)));
}


/******************************************************
 * ASSET COMPILATION & BUILD TASKS
******************************************************/
gulp.task("dev:styles", devStyles);
gulp.task("dev:scripts", devScripts);
gulp.task("prod:styles", prodStyles);
gulp.task("prod:scripts", prodScripts);

gulp.task('imagemin', function() {
  return gulp.src(bases.app + 'img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(bases.dist + 'img'));
});

// gulp.task('dev', gulp.parallel( "dev:styles", "dev:scripts"));
// gulp.task('prod', gulp.parallel("prod:styles","prod:scripts"));

gulp.task('pl-assets', gulp.series(
  gulp.parallel(
    gulp.series('dev:scripts', 'pl-copy:js', function(done){done();}),
    'pl-copy:img',
    'pl-copy:favicon',
    'pl-copy:font',
    gulp.series('dev:styles', 'pl-copy:css', function(done){done();}),
    'pl-copy:styleguide',
    'pl-copy:styleguide-css'
  ),
  function(done){
    done();
  })
);

gulp.task('pl-prod-assets', gulp.series(
  gulp.parallel(
    gulp.series('prod:scripts', 'pl-copy:prodjs', function(done){done();}),
    'pl-copy:img',
    'pl-copy:favicon',
    'pl-copy:font',
    gulp.series('prod:styles', 'pl-copy:css', function(done){done();}),
    'pl-copy:styleguide',
    'pl-copy:styleguide-css'
  ),
  function(done){
    done();
  })
);

gulp.task('patternlab:build', gulp.series('pl-assets', build, function(done){
  done();
}));

gulp.task('patternlab:prod-build', gulp.series('pl-prod-assets', build, function(done){
  done();
}));


/******************************************************
 * PATTERNLAB SETUP TASKS
******************************************************/
gulp.task('patternlab:version', function (done) {
  patternlab.version();
  done();
});

gulp.task('patternlab:help', function (done) {
  patternlab.help();
  done();
});

gulp.task('patternlab:patternsonly', function (done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
});

gulp.task('patternlab:liststarterkits', function (done) {
  patternlab.liststarterkits();
  done();
});

gulp.task('patternlab:loadstarterkit', function (done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
});

gulp.task('patternlab:installplugin', function (done) {
  patternlab.installplugin(argv.plugin);
  done();
});


/******************************************************
 * SERVER AND WATCH TASKS
******************************************************/
gulp.task('patternlab:connect', gulp.series(function(done) {
  browserSync.init({
    server: {
      baseDir: resolvePath(paths().public.root)
    },
    middleware: [middleware(__dirname + '/public')],
    snippetOptions: {
      // Ignore all HTML files within the templates folder
      blacklist: ['/index.html', '/', '/?*']
    },
    notify: {
      styles: [
        'display: none',
        'padding: 15px',
        'font-family: sans-serif',
        'position: fixed',
        'font-size: 1em',
        'z-index: 9999',
        'bottom: 0px',
        'right: 0px',
        'border-top-left-radius: 5px',
        'background-color: #1B2032',
        'opacity: 0.4',
        'margin: 0',
        'color: white',
        'text-align: center'
      ]
    }
  }, function(){
    console.log('PATTERN LAB NODE WATCHING FOR CHANGES');
    done();
  });
}));


/******************************************************
 * MASTER WATCH FUNCTION
******************************************************/
function watch() {
  gulp.watch(resolvePath(paths().source.scss) + '/**/*.scss', { awaitWriteFinish: true }).on('change', gulp.series('dev:styles', 'pl-copy:css', reloadCSS));
  gulp.watch(resolvePath(paths().source.srcjs) + '/**/*.js').on('change', gulp.series('dev:scripts', 'pl-copy:js'));
  gulp.watch(resolvePath(paths().source.styleguide) + '/**/*.*', { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:styleguide', 'pl-copy:styleguide-css', reloadCSS));

  var patternWatches = [
    resolvePath(paths().source.patterns) + '/**/*.json',
    resolvePath(paths().source.patterns) + '/**/*.md',
    resolvePath(paths().source.data) + '/*.json',
    resolvePath(paths().source.fonts) + '/*',
    resolvePath(paths().source.images) + '/*',
    resolvePath(paths().source.meta) + '/*',
    resolvePath(paths().source.annotations) + '/*',
    resolvePath(paths().source.scss) + '/*',
    resolvePath(paths().source.srcjs) + '/*'
  ].concat(getTemplateWatches());

  console.log(patternWatches);

  gulp.watch(patternWatches, { awaitWriteFinish: true }).on('change', gulp.series(build, reload));
}


/******************************************************
 * COMPOUND TASKS
******************************************************/
// Add my tasks to the series 
// The PL watch task will run after the CSS file built by my sass task is run. 

gulp.task('default', gulp.series('patternlab:build'));
gulp.task('patternlab:prod', gulp.series('patternlab:prod-build'));
gulp.task('patternlab:watch', gulp.series('patternlab:build', watch));
gulp.task('patternlab:serve', gulp.series('patternlab:build', 'patternlab:connect', watch));
