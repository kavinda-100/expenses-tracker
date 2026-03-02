import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router';

export default function MainLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1 overflow-auto">
				<div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
					<div className="flex h-14 items-center px-4">
						<SidebarTrigger className="mr-2" />
					</div>
				</div>
				<div className="px-6 py-3">
					<Outlet />
				</div>
			</main>
		</SidebarProvider>
	);
}
