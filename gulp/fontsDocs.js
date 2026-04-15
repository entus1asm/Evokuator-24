const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const fonter = require('gulp-fonter-fix');
const ttf2woff2 = require('gulp-ttf2woff2');
const { buildFontStyles } = require('./utils/font-utils');

const srcFolder = './src';
const destFolder = './docs';

gulp.task('otfToTtf:docs', () => {
	return gulp
		.src(`${srcFolder}/fonts/*.otf`, {})
		.pipe(
			fonter({
				formats: ['ttf'],
			})
		)
		.pipe(gulp.dest(`${srcFolder}/fonts/`))
		.pipe(
			plumber(
				notify.onError({
					title: 'FONTS:DOCS',
					message:
						'Error: <%= error.message %>. File: <%= file.relative %>!',
				})
			)
		);
});

gulp.task('ttfToWoff:docs', () => {
	return gulp
		.src(`${srcFolder}/fonts/*.ttf`, {})
		.pipe(
			fonter({
				formats: ['woff'],
			})
		)
		.pipe(gulp.dest(`${destFolder}/fonts/`))
		.pipe(gulp.src(`${srcFolder}/fonts/*.ttf`))
		.pipe(ttf2woff2())
		.pipe(gulp.dest(`${destFolder}/fonts/`))
		.pipe(
			plumber(
				notify.onError({
					title: 'FONTS:DOCS',
					message: 'Error: <%= error.message %>',
				})
			)
		);
});

gulp.task('fontsStyle:docs', (done) => {
	const fontsFile = path.resolve(`${srcFolder}/scss/base/_fontsAutoGen.scss`);
	const fontsDir = path.resolve(`${destFolder}/fonts/`);
	const fontFaces = buildFontStyles(fontsDir);

	fs.writeFileSync(fontsFile, fontFaces, 'utf8');
	done();
});

gulp.task('fontsDocs', gulp.series('otfToTtf:docs', 'ttfToWoff:docs', 'fontsStyle:docs'));
