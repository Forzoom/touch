const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const extensions = [ '.ts', '.js' ];

module.exports = exports = [
    {
        input: './src/index.ts',
        output: {
            file: './dist/touch.esm.js',
            format: 'esm',
        },
        plugins: [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                extensions,
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/touch.cjs.js',
            format: 'cjs',
        },
        plugins: [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                extensions,
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/touch.js',
            name: 'Touch',
            format: 'umd',
        },
        plugins: [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                extensions,
            }),
        ],
    },
];