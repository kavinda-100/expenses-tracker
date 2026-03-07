import ScreenHeader from "@/components/ScreenHeader";
import OverviewSection from "@/sections/Dashboard/OverviewSection";

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
        </div>
    );
};

export default HomeScreen;
