import { defineConfig } from 'vite';

// GitHub Pages のプロジェクトページは /torikko/ 配下。本番ビルドだけベースパスを付ける。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/torikko/' : '/',
}));
