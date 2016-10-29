'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

// Build app.js
gulp.task('scripts', function () {
    return gulp.src('restables.js')
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename('restables.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./'));
});

// Watch task
gulp.task('watch', function () {
    gulp.watch(['*.js'], ['scripts']);
});

// Build by default
gulp.task('default', ['scripts']);

gulp.task('build:watch', ['scripts', 'watch']);
