/**
*
* The packages we are using
*
**/
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var prefix       = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var babel        = require('gulp-babel');
var sourcemaps   = require('gulp-sourcemaps');
var concat       = require('gulp-concat');

/**
*
* Styles
* - Compile
* - Compress/Minify
* - Catch errors (gulp-plumber)
* - Autoprefixer
*
**/
gulp.task('sass', function() {
  gulp.src('sass/**/*.scss')
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
  .pipe(plumber())
  .pipe(gulp.dest('css'));
});



/**
*
* BrowserSync.io
* - Watch CSS, JS & HTML for changes
* - View project at: localhost:3000
*
**/
gulp.task('browser-sync', function() {
  browserSync.init(['css/*.css', 'js/**/*.js', 'index.html'], {
    server: {
      baseDir: './'
    }
  });
});



/**
*
* Javascript
* - compile to ES5
* - minify
*
**/
gulp.task('scripts', function() {
  return gulp.src('js/*.js')
  .pipe(concat('main.js'))
  .pipe(babel())
  .pipe(gulp.dest('js/compiled/'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('js/compiled/'));
});



/**
*
* Default task
* - Runs sass, browser-sync, scripts tasks
* - Watchs for file changes for scripts and sass/css
*
**/
gulp.task('default', ['sass', 'browser-sync', 'scripts'], function () {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['scripts']);
});
