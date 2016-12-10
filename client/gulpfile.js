var gulp    = require('gulp');
var gulpIf  = require('gulp-if');
var sass    = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var useref  = require('gulp-useref');
var uglify  = require('gulp-uglify');

gulp.task('sass', function(){
  return gulp.src('src/scss/styles.scss')
  .pipe(sass())
  .pipe(gulp.dest('src/css'))
});

gulp.task('build', function(){
  gulp.start('sass');
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
})
