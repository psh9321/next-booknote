import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: process.env.NODE_ENV === "production",
  reactStrictMode : process.env.NODE_ENV === "production",

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
      },
      {
        protocol : "https",
        hostname : "phinf.pstatic.net"
      },
      {
        protocol : "http",
        hostname : "*.kakaocdn.net",
      }
    ]
  }
};

export default nextConfig;
