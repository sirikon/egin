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
            'mithril': 'm',
            'fast-json-patch': 'jsonpatch',
            'dropbox': 'Dropbox',
            'hyperactiv': 'hyperactiv'
        }
    },
    external: [
        "mithril",
        "fast-json-patch",
        "dropbox",
        "hyperactiv"
    ],
    plugins: [
        copy({targets: [
            { src: './src/index.html', dest: 'dist' },
            { src: './src/dropbox-callback.html', dest: 'dist' },
            { src: `./node_modules/mithril/mithril${production ? '.min' : ''}.js`, dest: 'dist/vendor', rename: 'mithril.js' },
            { src: `./node_modules/fast-json-patch/dist/fast-json-patch${production ? '.min' : ''}.js`, dest: 'dist/vendor', rename: 'fast-json-patch.js' },
            { src: `./node_modules/hyperactiv/dist/index.js`, dest: 'dist/vendor', rename: 'hyperactiv.js' },
            { src: `./node_modules/dropbox/dist/Dropbox-sdk${production ? '.min' : ''}.js`, dest: 'dist/vendor', rename: 'dropbox-sdk.js' },
        ]}),
        scss({
            sass: require('sass'),
            outputStyle: production ? 'compressed' : 'expanded'
        }),
        !production && serve('dist'),
    ]
};
