import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
    input: '../src/libs.js',
    output: {
        name: 'eginlibs',
        file: '../dist/libs.js',
        format: 'iife'
    },
    plugins: [
        commonjs(),
        nodeResolve(),
        terser()
    ]
};
