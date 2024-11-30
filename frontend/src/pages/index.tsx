import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Welcome to Our Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Button asChild className="w-full">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
