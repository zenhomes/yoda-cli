import typescript from 'rollup-plugin-typescript2';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import builtins from 'rollup-plugin-node-builtins';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';

import pkg from './package.json';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
            sourcemap: true
        }
    ],
    plugins: [
        external(),
        url(),
        svgr(),
        resolve({
            preferBuiltins: true
        }),
        typescript({
            rollupCommonJSResolveHack: true,
            clean: true
        }),
        commonjs({
            namedExports: {
                'node_modules/lodash/lodash.js': [
                    'isNumber',
                    'isNil',
                    'isNull',
                    'isUndefined',
                    'size',
                    'isNaN',
                    'isInteger',
                    'isEmpty',
                    'get',
                    'isString',
                    'includes',
                    'find'
                ]
            }
        }),
        builtins(),
        preserveShebangs()
    ],
    onwarn(warning, rollupWarn) {
        if (warning.code !== 'CIRCULAR_DEPENDENCY') {
            rollupWarn(warning);
        }
    }
};
