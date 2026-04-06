import { NextAuthOptions } from "next-auth";

import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { API_USER_INFO } from "./server/api/api.user";

const maxAge = (60 * 60) * 4;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge : maxAge,
  },
  jwt: {
    maxAge : maxAge,
  },
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,

      profile(profile) {
        const r = profile.response;

        return {
          id: `${r.id}-naver`,
          name: r.nickname,
          type: "naver",
          profileImg: r.profile_image,
        } as any;
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,

      profile(profile) {
        const kakaoProfile = profile.kakao_account?.profile;
        
        return {
          id: `${String(profile.id)}-kakao`,
          name: kakaoProfile?.nickname,
          type: "kakao",
          profileImg : kakaoProfile.profile_image_url
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.type = (user as any).type;
        token.profileImg = (user as any).profileImg;

        const userInfo = await API_USER_INFO(user.id);

        token.book = userInfo["book"];
        token.booknote = userInfo["booknote"];
      }

      if (trigger === "update" && session?.user) {
        if (session.user.booknote !== undefined) token.booknote = session.user.booknote;
        if (session.user.book !== undefined) token.book = session.user.book;
      }

      return token;
    },

    session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};
