'use strict';

const del = require('del');

const gulp = require('gulp');  
const sass = require('gulp-sass');  
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const changed = require('gulp-changed');
const pug = require('gulp-pug');
const connect = require('gulp-connect');
const tsPipeline = require('gulp-webpack-typescript-pipeline');

const config = {
    buildDir: 'build/',
    srcDir: 'src/',
    templatesDir: 'views/',
    sassDir: 'sass/',
    assetsDir: 'assets/',

    development: process.env.NODE_ENV !== 'production'
};

gulp.task('sass', () => {
    const DEST = config.buildDir + config.assetsDir + 'css/';
    return gulp
        .src(config.srcDir + config.sassDir + '**/*.sass')
        .pipe(changed(DEST))
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(DEST))
        .pipe(connect.reload());
});
gulp.task('sass:watch', () => {
    return gulp.watch(config.srcDir + config.sassDir + '**/*.sass', ['sass']);
});

gulp.task('pug', () => {
    const DEST = config.buildDir;
    return gulp
        .src([config.srcDir + config.templatesDir + '**/*.pug', '!**/_*/**'])
        .pipe(pug({
            locals: {
                development: config.development,
            },
        }))
        .pipe(gulp.dest(DEST))
        .pipe(connect.reload());
});
gulp.task('pug:watch', () => {
    // We watch ALL pug files, while we ignore "_" folders
    return gulp.watch(config.srcDir + config.templatesDir + '**/*.pug', ['pug'])
});

tsPipeline.registerBuildGulpTasks(
    gulp,
    {
        entryPoints: {
            bundle: __dirname + '/' + config.srcDir + 'code/entry.ts',
        },
        outputDir: __dirname + '/' + config.buildDir + config.assetsDir + 'js/'
    }
);

gulp.task('assets', () => {
    const DEST = config.buildDir + config.assetsDir;
    return gulp
        .src(config.srcDir + config.assetsDir + '**/*')
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST))
        .pipe(connect.reload());
})
gulp.task('assets:watch', () => {
    return gulp.watch(config.srcDir + config.assetsDir + '**/*', ['assets'])
})

gulp.task('watch', [
    'sass:watch',
    'pug:watch',
    'tsPipeline:watch', 
    'assets:watch'
]);

gulp.task('build', [
    'sass',
    'pug',
    'tsPipeline:build:dev',
    'assets'
])

gulp.task('server', ['build'], () => {
    return connect.server({
        root: config.buildDir,
        livereload: true
    });
})

gulp.task('serve', ['watch', 'server'])

gulp.task('clean', () => {
    return del(config.buildDir)
})
