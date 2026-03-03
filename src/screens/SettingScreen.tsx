import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SettingScreen = () => {
    return (
        <div className="w-full h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your application preferences and data
                </p>
            </div>

            <Separator />

            {/* Appearance Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                    <CardDescription>
                        Customize how CrabLedger looks on your device
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="text-sm font-medium">Theme</div>
                            <div className="text-xs text-muted-foreground">
                                Choose between light, dark, or system theme
                            </div>
                        </div>
                        <ModeToggle />
                    </div>
                </CardContent>
            </Card>

            {/* Data Management Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Data Management</CardTitle>
                    <CardDescription>
                        Manage your account and application data
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Clear Data */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                                Clear Data
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Remove all transactions, budgets, and categories
                            </div>
                        </div>
                        <Button variant="destructive" className="w-36">
                            Clear Data
                        </Button>
                    </div>

                    <Separator />

                    {/* Delete Account */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                                Delete Account
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Permanently delete your account and all data
                                (future feature, currently disabled)
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            className="w-36"
                            disabled={true}
                        >
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* About Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="CrabLedger Logo"
                            className="w-10 h-10 rounded-lg"
                        />
                        <div>
                            <CardTitle className="text-lg">
                                About CrabLedger
                            </CardTitle>
                            <CardDescription>Version 0.1.0</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            CrabLedger is a modern, cross-platform desktop
                            application designed to help you take control of
                            your personal finances. Built with privacy in mind,
                            all your data stays securely on your device, no
                            cloud, no tracking, just you and your financial
                            data.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Track your income and expenses, set budgets by
                            category, and generate insightful reports to better
                            understand your spending habits. Whether you're
                            saving for a goal or simply want to stay organized,
                            CrabLedger makes personal finance management simple
                            and intuitive.
                        </p>
                    </div>

                    <Separator />

                    {/* Tech Stack */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Built With</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                Tauri v2
                            </span>
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                React
                            </span>
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                TypeScript
                            </span>
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                Rust
                            </span>
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                SQLite
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Open Source */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Open Source</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            CrabLedger is free and open-source software.
                            Contributions, bug reports, and feature requests are
                            welcome on GitHub. Licensed under the MIT License.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingScreen;
