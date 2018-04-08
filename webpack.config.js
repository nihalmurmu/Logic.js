const path = require('path');

module.exports = {
	mode: 'production',

	entry: './src/main/ts/main.ts',
	output: {
		path: path.resolve(__dirname, 'dist/main'),
		filename: 'bundle.js',
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: [ '.js', '.ts', '.tsx' ],
		modules: [ 'node_modules' ],
	},
	plugins: [],
};