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
          token.type = (user as any).type;

          const userInfo : MY_INFO | null = await API_MY_UTIL_INFO({
            userId : account?.providerAccountId ?? (user as any).id,
            userName : (user as any).nickName
          });

          if(userInfo) {
            token.id = userInfo.id
            token.book = userInfo.book;
            token.bookclub = userInfo.bookclub;
            token.profileImg = userInfo.profileImg;
            token.booknote = userInfo.booknote;
            token.scrapnote = userInfo.scrapnote;
            token.name = userInfo.name;
          }
          
      }
      return token;
    },

    session({ session, token }) {

        session.user.id = token.id;
        session.user.name = token.name!;
        session.user.profileImg = token.profileImg;
        session.user.type = token.type;
        session.user.book = token.book;
        session.user.bookclub = token.bookclub;
        session.user.booknote = token.booknote;
        session.user.scrapnote = token.scrapnote

      return session;
    }
  },
});
