import gulp from 'gulp';
import terser from 'gulp-terser'; // Verwende gulp-terser statt gulp-uglify-es
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import filter from 'gulp-filter'; // Korrekte Verwendung von gulp-filter

// Minifiziere und optimiere CSS
function styles() {
  return gulp.src('assets/css/styles.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/css'));
}

// Minifiziere JavaScript für Client-seitige Dateien
function minifyJS() {
  return gulp.src('assets/js/app.js')
    .pipe(terser()) // Verwende gulp-terser für die Minifizierung von JavaScript
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/js'));
}

// Minifiziere nur einfache HTML-PHP-Dateien (ohne komplexen PHP-Code)
function minifyPHP() {
  const phpFilter = filter([
    '**/*.php',
    '!**/*generate_sitemap*.php',  // Schließe alle Dateien mit "generate_sitemap" im Namen aus
    '!**/background_send_mail.php',
    '!**/getimgsize.php',
    '!**/includes/blog-preview.php',
    '!**/includes/breadcrumbs.php',
    '!**/includes/config-keywords.php',
    '!**/includes/latest-blog.php',
    '!**/send_mail.php',
    '!**/sitemap.xml',
    '!vendor/**/*'  // Schließe den gesamten vendor-Ordner aus
  ], { restore: true });

  return gulp.src([
    '**/*.php',
    '!**/*generate_sitemap*.php',  // Schließe alle Dateien mit "generate_sitemap" im Namen aus
    '!**/background_send_mail.php',
    '!**/getimgsize.php',
    '!**/includes/blog-preview.php',
    '!**/includes/breadcrumbs.php',
    '!**/includes/config-keywords.php',
    '!**/includes/latest-blog.php',
    '!**/send_mail.php',
    '!**/sitemap.xml',
    '!vendor/**/*'  // Schließe den gesamten vendor-Ordner aus
  ])
    .pipe(phpFilter)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      ignoreCustomFragments: [/<\?[\s\S]*?\?>/] // PHP-Blöcke ignorieren
    }))
    .pipe(phpFilter.restore)
    .pipe(gulp.dest('.'));
}

// Watch-Task für CSS und JavaScript (ohne PHP)
function watch() {
  gulp.watch('assets/css/styles.css', styles);
  gulp.watch('assets/js/app.js', minifyJS);
}

// Separater Task für PHP-Minifizierung, den du manuell aufrufst
export const phpmin = gulp.series(minifyPHP);

// Standard-Task für Watcher (ohne PHP)
export default gulp.series(
  gulp.parallel(styles, minifyJS),
  watch
);
