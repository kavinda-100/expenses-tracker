import ScreenHeader from "@/components/ScreenHeader";
import GetExpenseByCategory from "@/sections/report/GetExpenseByCategory";

const ReportsScreen = () => {
    return (
        <div className="w-full h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <ScreenHeader
                title="Reports"
                description="View and analyze your expense reports"
            />

            {/* First section */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Expense Overview */}
                <GetExpenseByCategory />
            </div>
        </div>
    );
};

export default ReportsScreen;
