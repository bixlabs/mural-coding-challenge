import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import './index.css';
import { BaseLayout } from './layouts/BaseLayout';
import { ToastRootContainer } from './lib/toast';
import AccountCreationPage from './pages/account/AccountCreationPage.tsx';
import HomePage from './pages/HomePage.tsx';
import PayoutCreationPage from './pages/payout/PayoutCreationPage.tsx';
import PayoutSearchPage from './pages/payout/PayoutSearchPage.tsx';

const queryClient = new QueryClient();

async function enableMocking() {
	const { worker } = await import('./mocks/browser');

	return worker.start();
}

enableMocking().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
					<BrowserRouter>
						<ToastRootContainer />
						<Routes>
							<Route path="/" element={<BaseLayout />}>
								<Route path="/accounts/create" element={<AccountCreationPage />} />
								<Route index element={<HomePage />} />
								<Route path="/payouts/create" element={<PayoutCreationPage />} />
								<Route path="/payouts/search" element={<PayoutSearchPage />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</ThemeProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</StrictMode>
	);
});
