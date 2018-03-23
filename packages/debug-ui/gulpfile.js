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
const typescript = require('gulp-typescript');

const config = {
    buildDir: 'build/',
    deployDir: 'build/deploy/',
    srcDir: 'src/',
    templatesDir: 'views/',
    sassDir: 'sass/',
    assetsDir: 'assets/',
    scriptsDir: 'scripts/',

    development: process.env.NODE_ENV !== 'production'
};

const scriptsTsProject = typescript.createProject(config.scriptsDir + 'tsconfig.json');

gulp.task('sass', () => {
    const DEST = config.deployDir + config.assetsDir + 'css/';
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
    const DEST = config.deployDir;
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

// TODO(ritave): This package is badly designed, write a similiar pipeline
tsPipeline.registerBuildGulpTasks(
    gulp,
    {
        entryPoints: {
            index: __dirname + '/' + config.srcDir + 'code/indexEntry.ts',
            newsroom: __dirname + '/' + config.srcDir + 'code/newsroomEntry.ts',
            article: __dirname + '/' + config.srcDir + 'code/articleEntry.ts',
            base: __dirname + '/' + config.srcDir + 'code/base.ts',
        },
        outputDir: __dirname + '/' + config.deployDir + config.assetsDir + 'js/',
        tsLintFile: __dirname + '/tslint.json',
    }
);

gulp.task('typescript:scripts', () => {
    const DEST = config.buildDir + config.scriptsDir;
    return scriptsTsProject
        .src()
        .pipe(scriptsTsProject())
        .pipe(gulp.dest(DEST));
});

gulp.task('assets', () => {
    const DEST = config.deployDir + config.assetsDir;
    return gulp
        .src(config.srcDir + config.assetsDir + '**/*')
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST))
        .pipe(connect.reload());
})
gulp.task('assets:scripts', () => {
    const DEST = config.buildDir + config.scriptsDir + config.assetsDir;
    return gulp
        .src(config.scriptsDir + config.assetsDir + '**/*')
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST));
});

gulp.task('assets:watch', () => {
    return gulp.watch(config.srcDir + config.assetsDir + '**/*', ['assets'])
})

gulp.task('watch', [
    'sass:watch',
    'pug:watch',
    'tsPipeline:watch', 
    'assets:watch'
]);

gulp.task('build:site', ['sass', 'pug', 'tsPipeline:build:dev', 'assets']);
gulp.task('build:scripts', ['assets:scripts', 'typescript:scripts']);

gulp.task('build', [
    'build:site',
    'build:scripts',
])

gulp.task('server', ['build'], () => {
    return connect.server({
        root: config.deployDir,
        livereload: true
    });
})

gulp.task('serve', ['watch', 'server'])
