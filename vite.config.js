import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // tên host, có thể là 'localhost' hoặc '0.0.0.0' nếu muốn truy cập từ các thiết bị khác trong mạng nội bộ.
    port: 5500, // port tùy chỉnh
  },
  css: {
    devSourcemap: true,
  },
});
