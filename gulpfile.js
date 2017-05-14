var gulp     = require('gulp');
var webpack  = require('webpack-stream');
var $        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var browser  = require('browser-sync');
var rimraf   = require('rimraf');
var sequence = require('run-sequence');

// Check for --production flag
var isProduction = !!(argv.production);
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

var PATHS = require('./paths.json');

gulp.task('javascript', function() {
    if (!!PATHS.src.js) {
        var config = (isProduction) ? './webpack.config.production.js' : './webpack.config.js';
        return gulp.src(PATHS.src.js)
            .pipe(webpack(require(config)))
            .pipe(gulp.dest(PATHS.dist.js));
    } else {
        console.log('\x1b[33m', 'PATHS.src.js is missing, task aborted', '\x1b[0m');
    }
});

// Delete the "dist" folder
// This happens every time a build starts
gulp.task('clean', function(done) {
    if (!!PATHS.dist.clean) {
        rimraf(PATHS.dist.clean, done);
    } else {
        console.log('\x1b[33m', 'PATHS.dist.clean is missing, task aborted', '\x1b[0m');
    }
});

// Browser Sync wrapper task
// allows for proper injection of css files
gulp.task('reload', function(cb) {
    if (!!PATHS.proxy) {
        browser.reload();
        cb();
    } else {
        console.log('\x1b[33m', 'PATHS.reload is missing, task aborted', '\x1b[0m');
    }
});

// Copy files out of the assets folder
// This task skips over the "images", "scripts", and "styles" folders, which are parsed separately
gulp.task('copy', function() {
    if (!!PATHS.src.copy) {
        return gulp.src(PATHS.src.copy)
            .pipe(gulp.dest(PATHS.dist.copy));
    } else {
        console.log('\x1b[33m', 'PATHS.src.copy is missing, task aborted', '\x1b[0m');
    }
});

// Compile Sass into CSS
// In production, the CSS is compressed
gulp.task('sass', function() {
    if (!!PATHS.src.sass) {
        var cleanCSS = $.if(isProduction, $.cleanCss());
        return gulp.src(PATHS.src.sass)
            .pipe($.sourcemaps.init())
            .pipe($.sass({
                    includePaths: PATHS.src.sass
                })
                .on('error', $.sass.logError))
            .pipe($.autoprefixer({
                browsers: COMPATIBILITY
            }))
            .pipe(cleanCSS)
            .pipe($.if(!isProduction, $.sourcemaps.write()))
            .pipe(gulp.dest(PATHS.dist.sass))
            .pipe(browser.reload({
                stream: true
            }));
    } else {
        console.log('\x1b[33m', 'PATHS.src.sass is missing, task aborted', '\x1b[0m');
    }
});


// Copy images to the "dist" folder
// In production, the images are compressed
gulp.task('images', function() {
    if (!!PATHS.src.images) {
        var imagemin = $.if(isProduction, $.imagemin({
            progressive: true
        }));

        return gulp.src(PATHS.src.images)
            .pipe(imagemin)
            .pipe(gulp.dest(PATHS.dist.images));
    } else {
        console.log('\x1b[33m', 'PATHS.src.images is missing, task aborted', '\x1b[0m');
    }
});

// Build the "assets" folder by running all of the above tasks
gulp.task('build', function(done) {
    sequence('clean', ['sass', 'javascript', 'images', 'copy'], done);
});

// Start a server with LiveReload to preview the site in
gulp.task('server', ['build'], function() {
    if (!!PATHS.proxy) {
        browser.init({
            proxy: PATHS.proxy,
        });
    } else {
        console.log('\x1b[33m', 'PATHS.proxy is missing, task aborted', '\x1b[0m');
    }
});

// Build the site, run the server, and watch for file changes
gulp.task('default', ['build', 'server'], function() {
    gulp.watch(PATHS.src.copy, ['copy', 'reload']);
    gulp.watch([PATHS.src.sass], ['sass', 'reload']);
    gulp.watch([PATHS.src.js], ['javascript', 'reload']);
});