"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});


gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 7 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.gifsicle({ interlaced: true }),
      imagemin.svgo()
    ], {
        verbose: true
      }))
    .pipe(gulp.dest("source/img"));

});

gulp.task("webp", function () {
  return gulp.src([
    "source/img/video*.jpg",
    "source/img/triple*.jpg",
    "source/img/photo*.jpg",
    "source/img/map*.jpg"
  ])
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img/test"));
});

gulp.task("sprite", function () {
  return gulp.src([
    "source/img/icon-search.svg",
    "source/img/icon-cart.svg",
    "source/img/icon-fb.svg",
    "source/img/icon-insta.svg",
    "source/img/icon-twitter.svg",
    "source/img/icon-right-arrow.svg",
    "source/img/icon-left-arrow.svg",
    "source/img/logo-footer.svg",
    "source/img/htmlacademy.svg",
  ])
    .pipe(svgstore({
      inlineSvg: true
    }))

    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img/test"));
});
gulp.task("start", gulp.series("css", "server"));
