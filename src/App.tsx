import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import MainLayout from './layouts/MainLayout';
import { HomeScreen, SettingScreen } from './screens';

const router = createBrowserRouter([
	{
		path: '/',
		Component: MainLayout,
		children: [
			{
				index: true,
				Component: HomeScreen,
			},
			{
				path: 'setting',
				Component: SettingScreen,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
