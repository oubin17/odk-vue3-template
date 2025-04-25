import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  // 从环境变量中读取 base 路径，如果未设置则使用默认值
  const base = env.VITE_BASE_URL || '/'

  return {
    base, // 根据环境变量动态设置打包路径
    plugins: [
      vue(),
      vueDevTools(), // ...
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
      Components({
        // 搜索组件的默认目录
        dirs: ['src/components'],
        // 默认文件扩展名
        extensions: ['vue'],
        // 是否递归搜索子目录
        deep: true,
        // 自动生成 `components.d.ts`，如果安装了 TypeScript 则默认为 `true`
        dts: true,

        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass', // 使用 SCSS 主题
          }),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['mdi'],
          }),
        ],
      }),
      Icons({
        autoInstall: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element/index.scss" as *;`,
        },
      },
    },
  }
})
