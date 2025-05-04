import {
	Slide,
	ToastContainer,
	ToastContainerProps,
	toast as toastify,
	ToastOptions as ToastifyOptions,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// Global container options
export const TOAST_CONTAINER_OPTIONS: ToastContainerProps = {
	limit: 3,
	position: 'top-center',
	theme: 'light',
	transition: Slide,
};

export function ToastRootContainer() {
	return <ToastContainer {...TOAST_CONTAINER_OPTIONS} />;
}

export type ToastOptions = {
	autoClose?: number | false;
	toastId?: string;
};

const DEFAULT_OPTIONS: ToastifyOptions = {
	autoClose: 3000,
};

export const appToast = {
	success(message: string = 'Success!', options: ToastOptions = {}) {
		toastify.success(message, {
			...DEFAULT_OPTIONS,
			...options,
		});
	},

	error(message: string = 'Oops.. Something Went Wrong..', options: ToastOptions = {}) {
		toastify.error(message, {
			...DEFAULT_OPTIONS,
			autoClose: 5000,
			...options,
		});
	},

	info(message: string = 'Informational message', options: ToastOptions = {}) {
		toastify.info(message, {
			...DEFAULT_OPTIONS,
			...options,
		});
	},

	clearAll() {
		toastify.dismiss();
	},
};
