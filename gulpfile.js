'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

 
gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(livereload());
});
 
gulp.task('sass:watch', function () {
  livereload.listen();
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('resizeimages', function() {
 return gulp.src('img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('images/'));
});

gulp.task('default', ['sass', 'sass:watch']);