import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import api from "@/src/utils/api";

type DecodedToken = {
    sub: string;
    exp: number;
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Credentials received:", credentials);
                if (!credentials) {
                    throw new Error("Missing credentials");
                }

                try {
                    const response = await axios.post(
                        "http://localhost/api/login",
                        new URLSearchParams({
                            username: credentials.username,
                            password: credentials.password,
                        }).toString(),
                        {
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        }
                    );
                   const user = response.data;

                    if (user && user.access_token) {
                        const decoded: DecodedToken = jwtDecode(user.access_token);
                        console.log("Decoded token:", decoded);
                        return {
                            id: decoded.sub,
                            access_token: user.access_token,
                        };
                    }

                    console.log("Authorization response:", response.data);
                    return null;
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
    pages: {
      signIn: "/api/login",
        error: "/auth/login"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.accessToken = user.access_token;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user = {
                id: token.id,
                accessToken: token.accessToken,
            };
            return session;
        },
    },
};

export default NextAuth(authOptions);
