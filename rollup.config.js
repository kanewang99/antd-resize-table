import babel from "rollup-plugin-babel";
import css from 'rollup-plugin-css-only'
import typescript from "rollup-plugin-typescript2";
import cjs from 'rollup-plugin-commonjs'
export default [
    {
        input: './src/index.tsx',
        output: {
            name: 'index',
            file: './lib/index.js',
            format: 'esm'
        },
        plugins: [
            typescript({ noEmitHelpers: true }),
            babel(),
            css({ output: 'resize-table.css' }),
            cjs()
        ]
    }
];



