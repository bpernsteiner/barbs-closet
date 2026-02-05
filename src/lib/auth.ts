import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnGate = nextUrl.pathname.startsWith("/gate");
      const isApi = nextUrl.pathname.startsWith("/api");

      // Allow API auth routes
      if (isApi) return true;

      // Allow gate and login pages
      if (isOnGate || isOnLogin) return true;

      // Require login for everything else
      if (!isLoggedIn) return false;

      return true;
    },
  },
});
