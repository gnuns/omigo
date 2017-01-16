const gulp        = require('gulp');
const gulpIf      = require('gulp-if');
const sass        = require('gulp-sass');
const cssnano     = require('gulp-cssnano');
const useref      = require('gulp-useref');
const uglify      = require('gulp-uglify');
const babel       = require('gulp-babel');
const browserSync = require('browser-sync').create();

gulp.task('sass', function(){
  return gulp.src('src/scss/styles.scss')
  .pipe(sass())
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({
      stream: true
    }))
});
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
});
gulp.task('build', function(){
  gulp.start('sass');

  gulp.src('node_modules/font-awesome/fonts/*.+(eot|ttf|svg|woff|woff2|otf)')
  .pipe(gulp.dest('dist/fonts'));

  gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(gulp.dest('dist/img'));

  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('js/main.min.js', babel({presets: ['es2015']})))
    .pipe(gulpIf('js/*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('live', ['sass', 'browserSync'], function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
})
