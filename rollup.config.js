import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import cjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'



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
            cjs(),
            postcss({
                plugins: []
            })
        ]
    }
];



