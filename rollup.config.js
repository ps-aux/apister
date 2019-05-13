import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default {
    input: 'src/index.ts',
    external: ['axios', 'joi'],
    output: [
        {
            file: 'build/index.js',
            format: 'es'
        }
    ],
    plugins: [
        resolve({extensions}),
        commonjs(),
        babel({
            extensions,
            include: ['src/**/*'],
            exclude: 'node_modules/**'
        })
    ]
}
