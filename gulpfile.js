var gulp = require('gulp');
var clean = require('gulp-clean');
var typescript = require('gulp-tsc');
var watch = require('glob-watcher');
var less = require('gulp-less-sourcemap');
var runseq = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var debug = require('gulp-debug');
var replace = require('gulp-replace');

gulp.task('default',function(cb){
    console.log('Starting the default task');
    runseq('clean:src','clean:dist','compile:typescriptMain','compile:adjustOutput','compile:typescript','compile:typescript-auth','compile:typescript-meta','compile:typescript-resource','compile:css','dist:copy',cb);
});

gulp.task('dev',function(cb){
    console.log('Starting the default task');
});

gulp.task('clean:dist', function () {
    return gulp.src(['dist'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('clean:src', function () {
    // this task is to clear the src folder if the mappings and js files ended up there.
    // typically happens when mixing webstorm typescript watchers and gulp.
    return gulp.src(['src/**/*.js','src/**/*.d.ts','!src/cheese/typings/**/*.d.ts','src/**/*.css','src/**/*.js.map'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('compile:typescriptMain',function() {
    return gulp.src(['src/cheese/cheese.ts'])
        .pipe(typescript({sourcemap: true, declaration: true, logErrors: true, resolve: true, out: 'cheese.js',outDir:'src/cheese'}))
        .pipe(gulp.dest('src/cheese'));
});

gulp.task('compile:adjustOutput',function(){
    gulp.src(['src/cheese/cheese.d.ts'])
        .pipe(replace('../src/cheese/',''))
        .pipe(replace('../src//cheese/',''))
        .pipe(gulp.dest('src/cheese'));
});

gulp.task('compile:typescript',function(cb){
    gulp.src(['src/cheese/metadata-service.ts'])
        .pipe(typescript({sourcemap: true,declaration:true,logErrors: true,resolve:true,out:'metadata-service.js',outDir:'src/cheese'}))
        .pipe(gulp.dest('src/cheese'));
    return gulp.src(['src/cheese/resource-service.ts'])
       .pipe(typescript({sourcemap: true,declaration:true,logErrors: true,resolve:true,out:'resource-service.js',outDir:'src/cheese'}))
       .pipe(gulp.dest('src/cheese'));
});

gulp.task('compile:typescript-auth',function(cb) {
    //auth
    return gulp.src(['src/cheese-auth-web-api/auth-service.ts'])
        .pipe(typescript({sourcemap: true, declaration: true, logErrors: true, resolve: true, out: 'auth-service.js', outDir: 'src/cheese-auth-web-api'}))
        .pipe(gulp.dest('src/cheese-auth-web-api'));
});


gulp.task('compile:typescript-meta',function(cb) {
    //meta-data
    gulp.src(['src/cheese-metadata-file/metadata-service-file.ts'])
        .pipe(typescript({sourcemap: true, declaration: true, logErrors: true, resolve: true, out: 'metadata-service-file.js', outDir: 'src/cheese-metadata-file'}))
        .pipe(gulp.dest('src/cheese-metadata-file'));
    return gulp.src(['src/cheese-metadata-web-api/metadata-service.ts'])
        .pipe(typescript({sourcemap: true, declaration: true, logErrors: true, resolve: true, out: 'metadata-service.js', outDir: 'src/cheese-metadata-web-api'}))
        .pipe(gulp.dest('src/cheese-metadata-web-api'));
});

gulp.task('compile:typescript-resource',function(cb) {
    //resource
    return gulp.src(['src/cheese-resource-web-api/resource-service.ts'])
        .pipe(typescript({sourcemap: true,declaration:true,logErrors: true,resolve:true,out:'resource-service.js',outDir:'src/cheese-resource-web-api'}))
        .pipe(gulp.dest('src/cheese-resource-web-api'));
});

gulp.task('dist:copy',function(){
    gulp.src(['src/cheese-bootstrap/fonts/**']).
        pipe(gulp.dest('dist/cheese-bootstrap/fonts'));
    return gulp.src(['src/**/*.d.ts','src/**/*.map','src/**/*.js','src/**/*.html','src/**/*.css'])
        .pipe(gulp.dest('dist'));
});

gulp.task('compile:css',function(){
    return gulp.src('src/**/*.less')
        .pipe(less({generateSourceMap:true}))
        .pipe(gulp.dest('src'));
});