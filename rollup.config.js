import copy from 'rollup-plugin-copy'
import scss from 'rollup-plugin-scss'
import serve from 'rollup-plugin-serve'

const production = !process.env.ROLLUP_WATCH

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/app.js',
        format: 'iife',
        globals: {
            mithril: 'm'
        }
    },
    external: [
        "mithril"
    ],
    plugins: [
        copy({targets: [
            { src: './src/index.html', dest: 'dist' },
            { src: `./node_modules/mithril/mithril${production ? '.min' : ''}.js`, dest: 'dist/vendor', rename: 'mithril.js' },
        ]}),
        scss(),
        !production && serve('dist'),
    ]
};
