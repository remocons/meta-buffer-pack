import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default [
  {
    input: './src/browser-index.js',
    output: [
      {
      file: pkg.browseriife,
      format: 'iife', // immediately-invoked function expression — suitable for <script> tags
      name: 'MBP',
      sourcemap: true
    },
      {  
      file: pkg.browser,
      format: 'es', // 
      name: 'MBP',
      sourcemap: true  
    }
  
  ],
    plugins: [
      resolve(), // tells Rollup how to find date-fns in node_modules
      commonjs(), // converts date-fns to ES modules
      terser() // minify, but only in production
    ]
  },
  {
    input: './src/index.js',
    output: [
      { file: pkg.cjs, format: 'cjs' },
      { file: pkg.esm, format: 'es' }
      ], 
    plugins: [
      resolve(), // tells Rollup how to find date-fns in node_modules
      commonjs(), // converts date-fns to ES modules
      terser() // minify, but only in production
    ]
  }

]
