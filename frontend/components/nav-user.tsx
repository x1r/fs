"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button";
import router, {useRouter} from "next/router"
import {Badge} from "./ui/badge"
import React from "react";
import {signOut} from "next-auth/react";

function AvatarWithFallback({
                                name,
                                size = "h-8 w-8",
                            }: {
    name: string;
    size?: string;
}) {
    const avatarUrl = `https://api.dicebear.com/9.x/initials/jpg?seed=${encodeURIComponent(
        name
    )}`;

    const initials = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return (
        <Avatar className={`${size} rounded-lg`}>
            <AvatarImage src={avatarUrl} alt={name}/>
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
    );
}

export function NavUser({
                            user,
                        }: {
    user: {
        name: string
        email: string
        role: string
    }
}) {
    const {isMobile} = useSidebar()
    const router = useRouter();
    const handleLogout = async () => {

        try {
            await signOut({redirect: false});
            router.push("/auth/login");
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <AvatarWithFallback name={user.name}/>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.name}
                                    <Badge variant="secondary" className="ml-1 text-xs">{user.role}</Badge>
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <AvatarWithFallback name={user.name}/>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}

                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        {/*<DropdownMenuSeparator/>*/}
                        {/*<DropdownMenuGroup>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <Sparkles/>*/}
                        {/*        Upgrade to Pro*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*</DropdownMenuGroup>*/}
                        {/*<DropdownMenuSeparator/>*/}
                        {/*<DropdownMenuGroup>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <BadgeCheck/>*/}
                        {/*        Account*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <CreditCard/>*/}
                        {/*        Billing*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <Bell/>*/}
                        {/*        Notifications*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*</DropdownMenuGroup>*/}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer">
                            <LogOut/>
                            <span>Log out</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
