var gulp = require("gulp"),
    // gulp-sass
    sass = require("gulp-sass"),
    // gulp-postcss
    postcss = require("gulp-postcss"),
    //autoprefixer
    autoprefixer = require("autoprefixer"),
    //cssnano
    cssnano = require("cssnano"),
    // gulp-sourcemaps
    sourcemaps = require("gulp-sourcemaps"),
    //browser-sync
    browserSync = require("browser-sync").create(),
    // gulp-enviroments
    environments = require('gulp-environments'),
    // gulp-uglify
    uglify = require('gulp-uglify'),
    // panini
    panini = require('panini'),
    // clean
    rimraf = require('rimraf'),
    //gulp-html
    validator = require('gulp-html');


// main directory
var main = "./";
/*
enviroments
*/

var development = environments.development;
var production = environments.production;

/* JS paths*/
var jspaths = {
    bootstrap: "node_modules/bootstrap/dist/js/bootstrap.min.js",
    popper : "node_modules/popper.js/dist/popper.min.js",
    tether: "node_modules/tether/dist/js/tether.min.js",
    jquery: "node_modules/jquery/dist/jquery.min.js",
    main: "src/js",
    mainDesc: "build/js"
};

/* JS Destination */
var jsdes = "build/js/inc";

// gulp information
gulp.task('hello', function() {
  console.log('========================');
  console.log('Gulp File RR Version v1.0.0');
  console.log('========================');
});

// Erases the dist folder contents
gulp.task('clean', function(cb) {
  rimraf('./build/*', cb);
});

/*
Setting enviroments (has an issue)
*/

gulp.task('set-dev', development.task);
gulp.task('set-prod', production.task);

/*
JS compile user define
*/
gulp.task ( 'js-compile', function (){
  return gulp
    .src(jspaths.main + '/**/*.js')
    .pipe(production(uglify()))
    .pipe(gulp.dest(jspaths.mainDesc))
    .pipe(browserSync.stream());
});

/*
JS to complile
*/
gulp.task ('compile-js', function () {
  return gulp
    // js paths source
    .src([jspaths.bootstrap, jspaths.popper, jspaths.tether, jspaths.jquery])
    // write to destination
    .pipe(gulp.dest(jsdes))
    .pipe(browserSync.stream());
});

/* bootstrap path*/
var paths = {
    bootstrap: {
      src: "node_modules/bootstrap/scss/bootstrap.scss",
      dest: "build/css/inc"
    },
    styles: {
      src: "src/scss/*.scss",
      dest: "build/css/"
    }
};
/*
bootstrap to complie
*/
gulp.task('compile-bootstrap', function (){
  return gulp
    .src(paths.bootstrap.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(production(postcss([autoprefixer(), cssnano()])))
    .pipe(gulp.dest(paths.bootstrap.dest))
    .pipe(browserSync.stream());
});

/*
Sass to compile
*/
gulp.task('compile-scss', function () {
  return gulp
    // sass location
    .src(paths.styles.src)
    //sourcemaps
    .pipe(development(sourcemaps.init()))
    //sass error log
    .pipe(sass().on('error', sass.logError))
    // Use postcss with autoprefixer and compress the compiled file using cssnano
    .pipe(production(postcss([autoprefixer(), cssnano()])))
    // Now add/write the sourcemaps
    .pipe(development(sourcemaps.write()))
    // sass destination
    .pipe(gulp.dest(paths.styles.dest))
    // Add browsersync stream pipe after compilation
    .pipe(browserSync.stream());
});

/* panini links */
var pages = {
    src : "./",
    desc: "build",
    devPanini: './html/**/*',
};

/*
panini tasks
*/
gulp.task('compile-html', function () {
  var url = 'html/',
    root = pages.src + url;

  return gulp
    .src(pages.src + url + 'pages/' + '**/*.html')
    .pipe(panini({
      root: root + 'pages/',
      layouts: root + 'layouts/',
      partials: root + 'partials/',
      helpers: root + 'helpers/',
      data: root + 'data/'
    }))
    .pipe(gulp.dest(pages.desc))
    // Add browsersync stream pipe after compilation
    .pipe(browserSync.stream());
});

/* Watch */
// A simple task to reload the page
function reload() {
    console.log('Refresh page');
    browserSync.reload();
};

// panini reset
function resetPanini(done) {
  console.log('Refresh panini');
  panini.refresh();
  done();
}

/*
 Images
*/

// image paths
var img = {
  src : "src/images/**/*",
  desc: "build/img"
}

// tranfer images
gulp.task('compile-img', function(){
  return gulp.src(img.src)
  .pipe(gulp.dest(img.desc));
});

/*
Minify content
*/

/*
Html Validator (Figuring out how this works)
*/

gulp.task('validate' , function () {
  return gulp.src('/build/**/*')
    .pipe(validator());
});


// Add browsersync initialization at the start of the watch task
gulp.task('watch', function () {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./build"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    // invoke gulp complile scss
    gulp.watch(paths.styles.src).on('change',gulp.series('compile-scss',reload,resetPanini));
    // panini
    gulp.watch('./html/{pages,layouts,partials,helpers,data}/**/*.html').on('change',gulp.series('compile-html',resetPanini, reload));

    // We should tell gulp which files to watch to trigger the reload
    // This can be html or whatever you're using to develop your website
    // Note -- you can obviously add the path to the Paths object
    // js Watch
    gulp.watch('src/js/**/*.js').on('change', gulp.series('js-compile',reload,resetPanini));
    //watch images
    gulp.watch('src/images/**/*').on('change', gulp.series('compile-img'));
});
// start the process default
gulp.task('default', gulp.parallel('hello','js-compile','compile-js','compile-bootstrap','compile-scss','compile-html','compile-img','watch'));

/* Compile without the bootstrap, to use bootstrap in includes under scss */
gulp.task('compile-nobs', gulp.parallel('hello','js-compile','compile-js','compile-scss','compile-html','compile-img','watch'));
