import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    copy({
      targets: [
        { src: 'src/assets/**/*', dest: 'dist/' },
      ]
    }),
  ]
};