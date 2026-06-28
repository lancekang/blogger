import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const bloggerScope = "https://www.googleapis.com/auth/blogger";
const googleScopes = ["openid", "email", "profile", bloggerScope].join(" ");

async function refreshAccessToken(token: {
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpires?: number;
}) {
  if (!token.refreshToken) {
    return {
      ...token,
      error: "RefreshAccessTokenError" as const
    };
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken
      }),
      signal: AbortSignal.timeout(10000)
    });

    const refreshedTokens = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
      refresh_token?: string;
      error?: string;
    };

    if (!response.ok || !refreshedTokens.access_token) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in ?? 3600) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError" as const
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: googleScopes,
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
        return token;
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    }
  }
};
