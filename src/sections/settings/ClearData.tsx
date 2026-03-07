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
import { X } from "lucide-react";
import { useTauriMutation } from "@/hooks/useTauriMutation";
import ErrorMessageBox from "@/components/ErrorMessageBox";

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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Data Cleared Successfully</DialogTitle>
                        <DialogDescription>
                            All your data has been successfully cleared.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose>
                            <Button>OK</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Clear Data Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button variant="destructive" className="w-36">
                        Clear Data
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex gap-3 justify-start items-center">
                            Clear All Data{" "}
                            <X className="inline text-destructive size-6" />
                        </DialogTitle>
                        <DialogDescription>
                            This action will permanently delete all your data.
                            This cannot be undone. Are you sure you want to
                            proceed?
                        </DialogDescription>
                        {clearDataMutationIsError && (
                            <ErrorMessageBox
                                message={
                                    clearDataMutationError ||
                                    "Failed to clear data. Please try again."
                                }
                            />
                        )}
                    </DialogHeader>
                    <DialogFooter className="flex gap-3">
                        <DialogClose disabled={clearDataMutationLoading}>
                            <Button variant="outline">No, Keep My Data</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleClearData}
                            disabled={clearDataMutationLoading}
                        >
                            {clearDataMutationLoading
                                ? "Clearing..."
                                : "Yes, Clear All Data"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClearData;
