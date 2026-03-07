import ScreenHeader from "@/components/ScreenHeader";
import GetExpenseByCategory from "@/sections/report/GetExpenseByCategory";
import GetIncomeByCategory from "@/sections/report/GetIncomeByCategory";
import MonthlyOverview from "@/sections/report/MonthlyOverview";
import YearlyOverview from "@/sections/report/YearlyOverview";

const ReportsScreen = () => {
    return (
        <div className="w-full h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <ScreenHeader
                title="Reports"
                description="View and analyze your expense and income reports"
            />

            {/* First section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Expense Overview */}
                <GetExpenseByCategory />
                {/* Income Overview */}
                <GetIncomeByCategory />
            </div>

            {/* monthly overview */}
            <MonthlyOverview />

            {/* yearly overview */}
            <YearlyOverview />
        </div>
    );
};

export default ReportsScreen;
