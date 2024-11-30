"use client"

import * as React from "react"
import {
    BookOpen,
    Bot,
    Briefcase,
    Building,
    ChartArea,
    ClipboardList,
    Contact,
    CreditCard,
    GalleryVerticalEnd,
    ListTodo,
    Package,
    ScrollText,
    Settings2,
    SquareTerminal,
    Users,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavTables} from "@/components/nav-tables"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useSession} from "next-auth/react";
import api from "@/src/utils/api";
import {headers} from "next/headers";
import axios from "axios"
import {useEffect, useState} from "react";

const data = {
    teams: [
        {
            name: "Company",
            logo: GalleryVerticalEnd,
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
                    url: "/dashboard/views",
                },
                {
                    title: "Log",
                    url: "/dashboard/log",
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
            name: "Clients",
            url: "/dashboard/clients",
            icon: Contact,
        },
        {
            name: "Orders",
            url: "/dashboard/orders",
            icon: ClipboardList,
        },
        {
            name: "Employees",
            url: "/dashboard/employees",
            icon: Briefcase,
        },
        {
            name: "Tasks",
            url: "/dashboard/tasks",
            icon: ListTodo,
        },
        {
            name: "Warehouses",
            url: "/dashboard/warehouses",
            icon: Building,
        },
        {
            name: "Equipments",
            url: "/dashboard/equipment",
            icon: Package,
        },
        {
            name: "Payment",
            url: "/dashboard/payments",
            icon: CreditCard,
        },
        {
            name: "Users",
            url: "/dashboard/users",
            icon: Users,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {data: session, status} = useSession();

    if (status === "unauthenticated") {
        return null;
    }


    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost/api/get_user_by_username", {
                // @ts-ignore
                    params: {username: session?.user?.id},
                });
                setUserData(response.data);
            } catch (e) {
                console.error("Error fetching user data:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session]);


    return (

        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavTables tables={data.tables}/>
                <NavMain items={data.navMain}/>
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