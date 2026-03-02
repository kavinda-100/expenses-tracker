import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
} from '@/components/ui/sidebar';
import { Link } from 'react-router';
import { Button } from './ui/button';

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader />
			<SidebarContent>
				{/* Dashboard Group */}
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<Button variant="outline" className="w-full" asChild>
							<Link to="/">Dashboard</Link>
						</Button>

						<Button variant="outline" className="w-full" asChild>
							<Link to="/transactions">Transactions</Link>
						</Button>

						<Button variant="outline" className="w-full" asChild>
							<Link to="/budget">Budget</Link>
						</Button>

						<Button variant="outline" className="w-full" asChild>
							<Link to="/reports">Reports</Link>
						</Button>

						<Button variant="outline" className="w-full" asChild>
							<Link to="/categories">Categories</Link>
						</Button>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Settings Group */}
				<SidebarGroup>
					<SidebarGroupLabel>Settings</SidebarGroupLabel>
					<SidebarGroupContent>
						<Button variant="outline" className="w-full" asChild>
							<Link to="/setting">Setting</Link>
						</Button>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
