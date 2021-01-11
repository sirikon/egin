import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
    input: '../src/base.js',
    output: {
        name: 'eginbase',
        file: '../dist/base.js',
        format: 'iife'
    },
    plugins: [
        commonjs(),
        nodeResolve(),
        terser()
    ]
};
