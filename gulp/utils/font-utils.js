const fs = require('fs');
const path = require('path');

const FONT_WEIGHT_MAP = {
	thin: 100,
	hairline: 100,
	extralight: 200,
	ultralight: 200,
	light: 300,
	regular: 400,
	book: 400,
	normal: 400,
	medium: 500,
	semibold: 600,
	demibold: 600,
	bold: 700,
	extrabold: 800,
	ultrabold: 800,
	heavy: 800,
	black: 900,
};

function getFontMeta(fontFileName) {
	const [rawFontName, rawVariant = 'Regular'] = fontFileName.split('-');
	const normalizedVariant = rawVariant.replace(/[_\s]+/g, '').toLowerCase();
	const fontStyle =
		normalizedVariant.includes('italic') || normalizedVariant.includes('oblique')
			? 'italic'
			: 'normal';

	let fontWeight = 400;
	for (const [key, value] of Object.entries(FONT_WEIGHT_MAP)) {
		if (normalizedVariant.includes(key)) {
			fontWeight = value;
			break;
		}
	}

	return {
		fontName: rawFontName || fontFileName,
		fontWeight,
		fontStyle,
	};
}

function buildFontStyles(fontsDir) {
	if (!fs.existsSync(fontsDir)) {
		return '';
	}

	const fontEntries = fs
		.readdirSync(fontsDir)
		.filter((fileName) => /\.(woff2?|ttf)$/i.test(fileName))
		.map((fileName) => path.parse(fileName).name)
		.filter((fileName, index, arr) => arr.indexOf(fileName) === index)
		.sort((a, b) => a.localeCompare(b));

	return fontEntries
		.map((fontFileName) => {
			const { fontName, fontWeight, fontStyle } = getFontMeta(fontFileName);

			return `@font-face {\n\tfont-family: '${fontName}';\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\n`;
		})
		.join('\n');
}

module.exports = {
	buildFontStyles,
};
