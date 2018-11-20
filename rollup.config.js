import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import common from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';
import bundleSize from 'rollup-plugin-bundle-size';

export default {
    input: 'src/wrapper.js',
    output: {
        name: 'VuePasswordInput',
        exports: 'named',
        sourcemap: 'inline',
        globals: {
            zxcvbn: 'zxcvbn'
        }
    },
    plugins: [
        common({
            include: [
                'node_modules/lodash.debounce', 
                'node_modules/whatwg-fetch'
            ]
        }),

        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),    
        vue({
            css: true,
            compileTemplate: true,
        }),
        buble(),
        // minify(),
        bundleSize()
    ],
    external: ['zxcvbn']
};