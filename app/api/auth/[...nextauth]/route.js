import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const { data: existingUser } = await supabase
          .from("auth.users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (existingUser) {
          user.id = existingUser?.id;
        } else {
          const { data } = await supabase.auth.signUp({
            email: user.email,
            password: crypto.randomUUID(),
            options: { data: { name: user.name } },
          });
          user.id = data.user.id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.user_metadata?.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
