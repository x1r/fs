import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Label} from "@/components/ui/label";

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        setError(null);
        const result = await signIn("credentials", {
            username: credentials.username,
            password: credentials.password,
            redirect: false,
        });
        console.log(credentials);
        if (result?.error) {
            setError(result.error);
        }

        await router.push("/dashboard");

    };

    return (
        <Card className="mx-auto max-w-sm my-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            placeholder="mail@example.com"
                            value={credentials.username}
                            required
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            placeholder="Password"
                            type="password"
                            required
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button onClick={handleLogin}>Login</Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="underline">
                            Sign up
                        </Link>
                    </div>
            </CardContent>
        </Card>
    );
};

export default LoginPage;
