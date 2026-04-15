const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const CWEBP_BINARY_CANDIDATES = [
	path.resolve('./node_modules/cwebp-bin/vendor/cwebp'),
	path.resolve('./node_modules/cwebp-bin/vendor/cwebp.exe'),
];

const SUPPORTED_WEBP_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const WEBP_TEST_IMAGE_BASE64 =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s1vxL8AAAAASUVORK5CYII=';

const findCwebpBinary = () =>
	CWEBP_BINARY_CANDIDATES.find((candidate) => fs.existsSync(candidate));

const ensureDirSync = (dirPath) => {
	fs.mkdirSync(dirPath, { recursive: true });
};

const walkFiles = (dirPath) => {
	const entries = fs.readdirSync(dirPath, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);

		if (entry.isDirectory()) {
			files.push(...walkFiles(fullPath));
			continue;
		}

		files.push(fullPath);
	}

	return files;
};

const isInsideDirectory = (filePath, directoryPath) => {
	const relativePath = path.relative(directoryPath, filePath);
	return relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
};

const runCwebp = ({ inputPath, outputPath, quality = 85 }) => {
	const binaryPath = findCwebpBinary();

	if (!binaryPath) {
		return false;
	}

	ensureDirSync(path.dirname(outputPath));

	const result = spawnSync(
		binaryPath,
		['-quiet', '-q', String(quality), '-o', outputPath, inputPath],
		{ stdio: 'ignore' }
	);

	return !result.error && result.status === 0 && fs.existsSync(outputPath);
};

const canUseCwebp = () => {
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cwebp-check-'));
	const inputPath = path.join(tempDir, 'test.png');
	const outputPath = path.join(tempDir, 'test.webp');

	try {
		fs.writeFileSync(inputPath, Buffer.from(WEBP_TEST_IMAGE_BASE64, 'base64'));
		return runCwebp({ inputPath, outputPath, quality: 80 });
	} catch (error) {
		return false;
	} finally {
		fs.rmSync(tempDir, { recursive: true, force: true });
	}
};

const generateWebpImages = ({ srcRoot, destRoot, exclude = [], quality = 85 }) => {
	const sourceRoot = path.resolve(srcRoot);
	const destinationRoot = path.resolve(destRoot);
	const excludedDirectories = exclude.map((entry) => path.resolve(entry));

	const files = walkFiles(sourceRoot).filter((filePath) => {
		const extension = path.extname(filePath).toLowerCase();

		if (!SUPPORTED_WEBP_EXTENSIONS.has(extension)) {
			return false;
		}

		return !excludedDirectories.some((directoryPath) =>
			isInsideDirectory(filePath, directoryPath) || filePath === directoryPath
		);
	});

	for (const filePath of files) {
		const relativePath = path.relative(sourceRoot, filePath);
		const outputPath = path.join(destinationRoot, relativePath).replace(/\.[^.]+$/, '.webp');

		if (
			fs.existsSync(outputPath) &&
			fs.statSync(outputPath).mtimeMs >= fs.statSync(filePath).mtimeMs
		) {
			continue;
		}

		const converted = runCwebp({
			inputPath: filePath,
			outputPath,
			quality,
		});

		if (!converted) {
			throw new Error(`Failed to convert image to webp: ${filePath}`);
		}
	}
};

module.exports = {
	canUseCwebp,
	generateWebpImages,
};
