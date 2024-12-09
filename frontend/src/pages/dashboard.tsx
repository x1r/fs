import {AppSidebar} from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useSession} from "next-auth/react";
import {BentoGridDashboard} from "@/components/bento-grid-dashboard";

export function Page() {
    // const {data: session, status} = useSession();
    // const router = useRouter();

    // useEffect(() => {
    //     const handleUnauthenticated = async () => {
    //         if (status === "unauthenticated") {
    //             await router.push("/auth/login");
    //         }
    //     };
    //
    //     handleUnauthenticated().then(r => r);
    // }, [status, router]);

    // if (status === "unauthenticated") {
    //     return null;
    // }

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block"/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage></BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div>
                    <BentoGridDashboard/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Page;