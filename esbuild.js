const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * Custom plugin to format error messages for better debugging in VS Code
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] Build started...');
		});
		build.onEnd((result) => {
			if (result.errors.length > 0) {
				console.error('[ERROR] Build failed with errors:');
				result.errors.forEach(({ text, location }) => {
					console.error(`✘ ${text}`);
					if (location) {
						console.error(`   ${location.file}:${location.line}:${location.column}`);
					}
				});
			} else {
				console.log('[watch] Build finished successfully ✅');
			}
		});
	},
};

async function main() {
	const ctx = await esbuild.context({
		entryPoints: ['src/extension.ts'],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [esbuildProblemMatcherPlugin], // Custom error handling plugin
	});

	if (watch) {
		console.log('[watch] Watching for changes...');
		await ctx.watch();
	} else {
		console.log('[build] Running one-time build...');
		await ctx.rebuild();
		await ctx.dispose();
		console.log('[build] Build complete ✅');
	}
}

main().catch(e => {
	console.error('[ERROR] Build process failed:', e);
	process.exit(1);
});
