import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const extensions = ['.js', '.ts']

const babelPresetESM = [
  [
    '@babel/preset-env',
    {
      targets: { esmodules: true },
    },
  ],
  '@babel/typescript',
]

const babelPresetNonESM = [
  [
    '@babel/preset-env',
    {
      targets: { esmodules: false },
    },
  ],
  '@babel/typescript',
]

const plugins = (presets) => {
  return [
    typescript(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      include: ['src/**/*'],
      presets,
      extensions,
    }),
    resolve({
      mainFields: ['browser', 'module', 'main'],
      extensions,
      preferBuiltins: true,
    }),
    commonjs(),
    terser({
      compress: true,
      mangle: false,
    }),
  ]
}

const clientBuilds = [
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'iife',
        extend: false,
        file: 'lib/index.iife.js',
        name: 'typedWebWorkers',
        sourcemap: false,
      },
    ],
    plugins: plugins(babelPresetNonESM),
  },
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'esm',
        extend: false,
        file: 'lib/index.esm.js',
        sourcemap: false,
      },
    ],
    plugins: plugins(babelPresetESM),
  },
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'cjs',
        extend: false,
        file: 'lib/index.cjs.js',
        sourcemap: false,
      },
    ],
    plugins: plugins(babelPresetNonESM),
  },
]
export default clientBuilds
