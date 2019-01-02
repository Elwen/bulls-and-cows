'use strict';

/* Plugins */

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const pug = require('gulp-pug');





/* Paths & names */

const folder = {
  src: 'src',
  output: 'assets'
};

const path = {
  src: {
    styles:     folder.src + '/sass/*.sass',
    scripts:    folder.src + '/js/*.js',
    templates:  folder.src + '/pug/*.pug'
  },
  build: {
    styles:     folder.output,
    scripts:    folder.output,
    templates:  '.'
  },
  watch: {
    styles:     folder.src + '/sass/**/*.sass',
    scripts:    folder.src + '/js/*.js',
    templates:  folder.src + '/pug/**/*.pug'
  }
};

const name = {
  styles:   'styles.min.css',
  scripts:  'scripts.min.js'
};





/* Tasks */

gulp.task('sass', () => {
  return gulp.src(path.src.styles)
  .pipe(plumber())
  .pipe(sass().on('error', (error) => {
    process.stderr.write(`${error.messageFormatted}\n`);
    process.exit(1)
  }))
  .pipe(autoprefixer({
    browsers: ['last 3 versions'],
    cascade: false
  }))
  .pipe(concat(name.styles))
  .pipe(cleanCSS({
    level: 1,
    debug: true
  }, (results) => {
    if (results.errors.length > 0) {
      process.stderr.write(`Error at gulp-clean-css \n ${results.errors}`);
      process.exit(1)
    }
  }))
  .pipe(gulp.dest(path.build.styles))
  .pipe(browserSync.reload({
    stream: true
  }))
});



gulp.task('scripts', () => {
  return gulp.src([path.src.scripts])
  .pipe(minify({
    ext: {
      min:'.min.js'
    },
    noSource: true,
    mangle: false
  }))
  .pipe(gulp.dest(path.build.scripts))
});



gulp.task('pug', () => {
  return gulp.src(path.src.templates)
  .pipe(pug({
    skip: ['layouts', 'parts'],
    pretty: true
  }).on('error', (error) => {
    browserSync.notify(error.message);
    console.log(error.message)
  }))
  .pipe(gulp.dest(path.build.templates))
  .pipe(browserSync.reload({
    stream: true
  }))
});



gulp.task('browser-sync', () => {
  browserSync.init({
    reloadOnRestart: false,
    server: {
      baseDir: '.',
      directory: true
    }
  });
});



gulp.task('watch', () => {
  gulp.watch(path.watch.styles, gulp.task('sass'));
  gulp.watch(path.watch.scripts, gulp.task('scripts'));
  gulp.watch([path.watch.templates, path.src.templates], gulp.task('pug'));
});



gulp.task('default', gulp.parallel(['sass', 'scripts', 'pug']));

gulp.task('devs', gulp.parallel(['sass', 'scripts', 'pug', 'watch', 'browser-sync']));
