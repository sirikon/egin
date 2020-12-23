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
            mithril: 'm',
            'fast-json-patch': 'jsonpatch'
        }
    },
    external: [
        "mithril",
        "fast-json-patch"
    ],
    plugins: [
        copy({targets: [
            { src: './src/index.html', dest: 'dist' },
            { src: `./node_modules/mithril/mithril${production ? '.min' : ''}.js`, dest: 'dist/vendor', rename: 'mithril.js' },
            { src: `./node_modules/fast-json-patch/dist/fast-json-patch${production ? '.min' : ''}.js`, dest: 'dist/vendor', rename: 'fast-json-patch.js' }
        ]}),
        scss({
            sass: require('sass'),
            outputStyle: production ? 'compressed' : 'expanded'
        }),
        !production && serve('dist'),
    ]
};
