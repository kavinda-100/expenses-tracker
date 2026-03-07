import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertTriangle,
    Trash2,
    CheckCircle2,
    Database,
    Receipt,
    Wallet,
    FolderOpen,
    TrendingDown,
} from "lucide-react";
import { useTauriMutation } from "@/hooks/useTauriMutation";
import ErrorMessageBox from "@/components/ErrorMessageBox";
import { cn } from "@/lib/utils";

const ClearData = () => {
    const [open, setOpen] = React.useState(false);
    const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
    // Tauri mutation to clear all data
    const {
        data: clearDataMutationData,
        loading: clearDataMutationLoading,
        isError: clearDataMutationIsError,
        error: clearDataMutationError,
        mutationAsync: clearDataMutationAsync,
    } = useTauriMutation<string, string>();

    // Effect to handle clear data mutation response
    React.useEffect(() => {
        if (
            !clearDataMutationLoading &&
            !clearDataMutationIsError &&
            clearDataMutationData
        ) {
            // Close the dialog after successful data clearing
            setOpen(false);
            // Optionally, you can show a success message or trigger a refetch of data here
            setOpenSuccessDialog(true);
        }
    }, [
        clearDataMutationData,
        clearDataMutationLoading,
        clearDataMutationIsError,
    ]);

    // Handler for clearing all data
    const handleClearData = async () => {
        await clearDataMutationAsync("clear_all_data_from_database");
    };

    return (
        <>
            {/* Success Dialog */}
            <Dialog
                open={openSuccessDialog}
                onOpenChange={setOpenSuccessDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-full bg-green-100 dark:bg-green-950">
                                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500" />
                            </div>
                            <DialogTitle>Data Cleared Successfully</DialogTitle>
                        </div>
                        <DialogDescription className="pt-2">
                            All your data has been permanently deleted from the
                            database. You can now start fresh with your expense
                            tracking.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <DialogClose asChild>
                            <Button className="w-full sm:w-auto">Got it</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Clear Data Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Clear All Data
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-full bg-red-100 dark:bg-red-950">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
                            </div>
                            <DialogTitle className="text-xl">
                                Clear All Data
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-base pt-2">
                            This action will{" "}
                            <span className="font-semibold text-destructive">
                                permanently delete
                            </span>{" "}
                            all your data from the database. This operation{" "}
                            <span className="font-semibold">
                                cannot be undone
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    {/* What will be deleted section */}
                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardContent className="pt-4">
                            <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                The following data will be deleted:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Receipt className="w-4 h-4 text-destructive" />
                                    All transactions (income & expenses)
                                </li>
                                <li className="flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-destructive" />
                                    All budget entries
                                </li>
                                <li className="flex items-center gap-2">
                                    <FolderOpen className="w-4 h-4 text-destructive" />
                                    All custom categories
                                </li>
                                <li className="flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-destructive" />
                                    All financial reports and history
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Error message */}
                    {clearDataMutationIsError && (
                        <ErrorMessageBox
                            message={
                                clearDataMutationError ||
                                "Failed to clear data. Please try again."
                            }
                        />
                    )}

                    <DialogFooter className="gap-2 sm:gap-4">
                        <DialogClose
                            asChild
                            disabled={clearDataMutationLoading}
                        >
                            <Button
                                variant="outline"
                                className="flex-1 sm:flex-none"
                            >
                                No, Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleClearData}
                            disabled={clearDataMutationLoading}
                            className={cn(
                                "flex-1 sm:flex-none gap-2",
                                clearDataMutationLoading && "opacity-50",
                            )}
                        >
                            {clearDataMutationLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Clearing...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Yes, Delete Everything
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClearData;
