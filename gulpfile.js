const gulp = require('gulp'),
      concat = require('gulp-concat'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      cleanJS = require('gulp-uglify'),
      del = require('del'),
      browserSync = require('browser-sync').create(),
      sass = require('gulp-sass');

const scssFiles = [
    './src/scss/*.scss',
];

const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'    
];

sass.compiler = require('node-sass');

function styles() {
    return gulp.src(scssFiles)
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulp.dest('./build/css'))
                .pipe(browserSync.stream());      
}

function scripts() {
    return gulp.src(jsFiles)
               .pipe(concat('srcipt.js'))
               .pipe(cleanJS({
                   toplevel: true
                }))
               .pipe(gulp.dest('./build/js'))
                .pipe(browserSync.stream());    
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

//смотрим изменения файлов в папке и, если изменяются, запускаем функцию, записанную вторым параметром (styles).
    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch('./src/js/**/*.js', scripts);
//а тут запускаем браузер при изменения html
    gulp.watch('./*html', browserSync.reload);
}

function clean() {
    return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
//gulp.series позволяет запускать таски последователно (один за другим)
gulp.task('build', gulp.series(clean,
//gulp.parallel позволяет запускать таски в параллельном режиме
                        gulp.parallel(styles, scripts)
                   ));

//говорит, сначала запусти билд (предыдущий таск), затем watch (отслеживание)
gulp.task('dev', gulp.series('build', 'watch'));