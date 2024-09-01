import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default [
  {
    input: './src/index.js',
    output: [
      { 
        file: "./dist/meta-buffer-pack.cjs", 
        format: 'cjs' 
      },
      // { 
      //   file: "./dist/meta-buffer-pack.mjs", 
      //   format: 'es' 
      // },
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs()
      , terser()
    ]
  },
  {
    input: './src/index.js',
    output: [
      {
        file: "./dist/meta-buffer-pack.iife.js",
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        name: 'MBP',
        sourcemap: true
      },
      {
        file: "./dist/meta-buffer-pack.js",
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: false
      }),
      commonjs()
      , terser()
    ]
  }

]
