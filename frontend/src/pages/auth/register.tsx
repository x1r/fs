import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Схема валидации
const registrationSchema = z.object({
    full_name: z.string().min(3, "Full name must be at least 3 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegistrationFormInputs = z.infer<typeof registrationSchema>;

const RegisterPage = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegistrationFormInputs>({
        resolver: zodResolver(registrationSchema),
    });

    const handleRegister = async (data: RegistrationFormInputs) => {
        setError(null);
        try {
            console.log(data);
            await axios.post("http://localhost/api/register", data);
            router.push("/auth/login"); // Перенаправляем на страницу логина
        } catch (err: any) {
            setError(err.response?.data?.detail || "Registration failed");
        }
    };

    return (
        <Card className="mx-auto max-w-sm my-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Registration</CardTitle>
                <CardDescription>
                    Enter data below to register your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleRegister)} className="grid gap-4">
                    <div>
                        <Input
                            placeholder="Full Name"
                            {...register("full_name")}
                        />
                        {errors.full_name && (
                            <p className="text-red-500 text-sm">{errors.full_name.message}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            placeholder="Username"
                            {...register("username")}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm">{errors.username.message}</p>
                        )}
                    </div>
                    <div>
                        <Input
                            placeholder="Password"
                            type="password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <Button type="submit">Register</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default RegisterPage;
