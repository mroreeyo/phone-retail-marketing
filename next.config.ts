import type { NextConfig } from "next";

// cacheComponents는 끈다: 고객용은 force-static + 저장 시 revalidatePath로 충분하고,
// Netlify에서 검증된 기존 ISR 경로를 쓰기 위함.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
