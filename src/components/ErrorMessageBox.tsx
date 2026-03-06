import { AlertCircle } from "lucide-react";

const ErrorMessageBox = ({ message }: { message: string }) => {
    return (
        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20 mt-4">
            <AlertCircle className="h-4 w-4" />
            <p className="text-xs font-medium text-pretty">{message}</p>
        </div>
    );
};

export default ErrorMessageBox;
