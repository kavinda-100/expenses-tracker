import ScreenHeader from "@/components/ScreenHeader";
import OverviewSection from "@/sections/Dashboard/OverviewSection";
import PastSevenDaysData from "@/sections/Dashboard/PastSevenDaysData";
import RecentTransactions from "@/sections/Dashboard/RecentTransactions";

const HomeScreen = () => {
    return (
        <div className="w-full h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <ScreenHeader
                title="Dashboard"
                description="See an overview of your transactions, categories, and budgets"
            />

            {/* Overview Section */}
            <OverviewSection />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Past 7 Days Data */}
                <PastSevenDaysData />

                {/* Recent Transactions */}
                <RecentTransactions />
            </div>
        </div>
    );
};

export default HomeScreen;
