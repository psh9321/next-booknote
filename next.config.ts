import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode : false,
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/:path*`
      }
    ]
  },
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
      },
      {
        protocol : "https",
        hostname : "phinf.pstatic.net"
      },
      {
        protocol : "http",
        hostname : "localhost",
        port : "9321",
        pathname : "/**"
      }
    ]
   },
   compiler : {
    removeConsole : process.env.NODE_ENV === "production"
   }
};

export default nextConfig;
