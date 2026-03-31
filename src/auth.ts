import NextAuth from "next-auth";
import NaverProvider from "next-auth/providers/naver";

import KakaoProvider from "next-auth/providers/kakao"
import { API_MY_UTIL_INFO } from "./shared/api/api.my.book";

const maxAge = (60 * 60) * 4;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session : {
    strategy : "jwt",
    maxAge
  },
  jwt : {
    maxAge
  },
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,

      profile(profile) {
        const r = profile.response;

        return {
          id : `${r.id}-naver`,
          nickName: r.nickname,
          profileImg: r.profile_image,
          type : "naver"

        } as any;
      }
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,

      profile(profile) {
        const kakaoProfile = profile.kakao_account?.profile;

        return {
          id : `${String(profile.id)}-kakao`,
          nickName : kakaoProfile?.nickname,
          profileImg : kakaoProfile?.profile_image_url,
          type : "kakao"
        } as any
      }
    })
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async signIn() {
      // console.log("user", user);
      // console.log("account", account);
      // console.log("profile", profile);

      return true;
    },

    async jwt({ token, user, account }) {
        
      // 최초 로그인 시에만 user가 존재함
      if (user) {
          token.id = account?.providerAccountId ?? (user as any).id;
          token.nickName = (user as any).nickName;
          token.profileImg = (user as any).profileImg;
          token.type = (user as any).type;

          const utilInfo = await API_MY_UTIL_INFO(token.id);

          if(utilInfo) token.utilInfo = utilInfo as MY_UTIL_INFO;
          
      }
      return token;
    },

    session({ session, token }) {
        session.user.id = token.id;
        session.user.name = token.nickName;
        session.user.image = token.profileImg;
        session.user.type = token.type;
        session.user.util = token.utilInfo

      return session;
    }
  },
});
