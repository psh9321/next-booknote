import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode : false,
  /* config options here */
   productionBrowserSourceMaps : process.env.NODE_ENV === "production",
   images : {
    remotePatterns : [
      {
        protocol : "https",
        hostname : "image.aladin.co.kr",
      },
      {
        protocol : "https",
        hostname : "cover.nl.go.kr"
      },
      {
        protocol : "https",
        hostname : "*.kakaocdn.net",
      },
      {
        protocol : "https",
        hostname : "*.kakao.com",
      },
      {
        protocol : "https",
        hostname : "*.naver.com",
      },
      {
        protocol : "https",
        hostname : "*.naver.net",
      },
      {
        protocol:"https",
        hostname : "ssl.pstatic.net"
      }
    ]
   },
   compiler : {
    removeConsole : process.env.NODE_ENV === "production"
   }
};

export default nextConfig;
