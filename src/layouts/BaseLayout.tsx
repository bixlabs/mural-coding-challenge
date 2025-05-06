import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, Outlet, NavLink as RouterNavLink } from 'react-router';

export function BaseLayout() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b shadow-sm">
				<div className={`mx-auto flex h-16 items-center justify-between px-4`}>
					<Link to="/" className="text-primary flex items-center gap-2">
						<Logo />
						<span className="text-lg font-semibold tracking-tight">Mural Coding Challenge</span>
					</Link>
					<nav className="flex gap-2">
						<NavLink to="/">Home</NavLink>
						<NavLink to="/accounts/create">Create Account</NavLink>
						<NavLink to="/payouts/create">Create Payout</NavLink>
						<NavLink to="/payouts/search">Search Payouts</NavLink>
					</nav>
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl px-4 py-10">
				<Outlet />
			</main>
		</div>
	);
}

function Logo() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="text-primary"
		>
			<path
				d="M30 20 L65 50 L30 80"
				stroke="currentColor"
				strokeWidth="14"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<rect x="38" y="38" width="24" height="24" transform="rotate(45 50 50)" fill="currentColor" />
		</svg>
	);
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<RouterNavLink
			to={to}
			className={({ isActive }) =>
				cn(buttonVariants({ variant: 'ghost' }), 'text-sm', isActive && 'text-primary underline underline-offset-4')
			}
		>
			{children}
		</RouterNavLink>
	);
}
