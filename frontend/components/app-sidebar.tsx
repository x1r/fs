"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {BookOpen, ChartArea, Contact, Settings2, Users,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavTables} from "@/components/nav-tables"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {useSession} from "next-auth/react";
import axios from "axios"

const data = {
    teams: [
        {
            name: "University",
            logo: BookOpen,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Analytics",
            url: "#",
            icon: ChartArea,
            items: [
                {
                    title: "Views",
                    url: "#",
                },
                {
                    title: "Log",
                    url: "#",
                }
            ]
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
            ],
        },
    ],
    tables: [
        {
            name: "Students",
            url: "/dashboard/students",
            icon: Contact,
        },
        {
            name: "Users",
            url: "/dashboard/users",
            icon: Users,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    // const {data: session, status} = useSession();
    //
    // if (status === "unauthenticated") {
    //     return null;
    // }


    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // if (!session?.user?.email) {
            //     console.error("No session email available.");
            // }

            try {
                const response = await axios.get("http://localhost/fastapi/get_user_by_username", {
                // @ts-ignore
                    params: { username: session?.user?.id },
                });
                setUserData(response.data);
            } catch (e) {
                console.error("Error fetching user data:", e);
                setUserData(
                    {username: "test@us.er", full_name: "Test User"}
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    // }, [session]);
    }, []);


    return (

        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavTables tables={data.tables}/>
                <div className="!text-muted">
                    <NavMain items={data.navMain}/>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={{
                        name: userData?.full_name || "Unknown",
                        email: userData?.username || "Unknown",
                        role: userData?.role || "user",
                    }}
                />
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}