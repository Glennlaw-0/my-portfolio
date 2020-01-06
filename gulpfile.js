// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
var replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// File path variables
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js',
};

// Sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('dist')); // put final CSS in dist folder
}

// JS task
function jsTask() {
  return src(files.jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('dist'));
}
// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask() {
  return src(['index.html'])
    .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
    .pipe(dest('.'));
}

// Watch task
function watchTask() {
  watch(
    [files.scssPath, files.jsPath],
    series(parallel(scssTask, jsTask), cacheBustTask),
  );
}

// Default task
exports.default = series(
  parallel(scssTask, jsTask),
  cacheBustTask,
  watchTask,
);
