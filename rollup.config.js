/*
 * @Author: sunji 2025506282@qq.com
 * @Date: 2022-06-17 13:43:13
 * @LastEditors: sunji 2025506282@qq.com
 * @LastEditTime: 2022-07-22 11:41:41
 * @FilePath: \vue-ue-sdk\rollup.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import babel from 'rollup-plugin-babel'
import resolve from "@rollup/plugin-node-resolve";
import VuePlugin from 'rollup-plugin-vue'
import unassert from 'rollup-plugin-unassert';
import commonjs from "@rollup/plugin-commonjs"
import css from 'rollup-plugin-css-only' // 提取css，压缩能力不行
import CleanCSS from 'clean-css' // 压缩css

import {
  writeFileSync
} from 'fs' // 写文件
import {
  terser
} from 'rollup-plugin-terser'
const extensions = [".js"];


export default {
  input: './src/index.js',
  output: {
    file: './dist/bundle.esm.js',
    format: 'esm', //若打包commonjs
    assetFileNames: "[name]-[hash][extname]"
  },
  // external: ["vue", "@vue/compiler-sfc"],
  plugins: [

    resolve(),

    babel({
      exclude: "node_modules/**",
      extensions,
      runtimeHelpers: true,
    }),

    commonjs(),
    VuePlugin({
      css: false
    }),
    css({
      output(style) {
        // 压缩 css 写入 dist/vue-rollup-component-template.css
        writeFileSync('./dist/index.css', new CleanCSS().minify(style).styles)
      }
    }),
    // css: false 将<style>块转换为导入语句，rollup-plugin-css-only可以提取.vue文件中的样式       
    unassert(),
    terser()

  ],
  treeshake: {
    moduleSideEffects: false,
  }
}