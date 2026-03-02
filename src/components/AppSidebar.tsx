import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    BarChart3,
    FolderOpen,
    Settings,
} from "lucide-react";
import { APP_NAME } from "@/constants";

export function AppSidebar() {
    const year = new Date().getFullYear();
    return (
        <Sidebar className="border-r">
            <SidebarHeader className="border-b p-4 h-14">
                <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h2 className="text-lg font-semibold">{APP_NAME}</h2>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                {/* Dashboard Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="mt-2 space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 hover:bg-accent"
                            asChild
                        >
                            <Link to="/">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 hover:bg-accent"
                            asChild
                        >
                            <Link to="/transactions">
                                <ArrowLeftRight className="h-4 w-4" />
                                Transactions
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 hover:bg-accent"
                            asChild
                        >
                            <Link to="/budget">
                                <Wallet className="h-4 w-4" />
                                Budget
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 hover:bg-accent"
                            asChild
                        >
                            <Link to="/reports">
                                <BarChart3 className="h-4 w-4" />
                                Reports
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 hover:bg-accent"
                            asChild
                        >
                            <Link to="/categories">
                                <FolderOpen className="h-4 w-4" />
                                Categories
                            </Link>
                        </Button>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Settings Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                        Settings
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="mt-2 space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 hover:bg-accent"
                            asChild
                        >
                            <Link to="/setting">
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <p className="text-xs text-muted-foreground">
                    © {year} {APP_NAME}
                </p>
            </SidebarFooter>
        </Sidebar>
    );
}
