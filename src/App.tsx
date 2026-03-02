import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from "./layouts/MainLayout";
import {
    HomeScreen,
    SettingScreen,
    TransactionsScreen,
    BudgetScreen,
    ReportsScreen,
    CategoriesScreen,
} from "./screens";

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: HomeScreen,
            },
            {
                path: "transactions",
                Component: TransactionsScreen,
            },
            {
                path: "budget",
                Component: BudgetScreen,
            },
            {
                path: "reports",
                Component: ReportsScreen,
            },
            {
                path: "categories",
                Component: CategoriesScreen,
            },
            {
                path: "setting",
                Component: SettingScreen,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
