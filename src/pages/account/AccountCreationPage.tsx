import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateAccount } from '@/hooks/useCreateAccount';
import { appToast } from '@/lib/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

const REQUIRED_ERROR_MESSAGE = 'Your account name is required';

const formSchema = z.object({
	name: z
		.string({
			required_error: REQUIRED_ERROR_MESSAGE,
		})
		.min(1, { message: REQUIRED_ERROR_MESSAGE }),
	description: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function AccountCreationPage() {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
	});

	const {
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = form;

	const navigate = useNavigate();

	const { createAccount } = useCreateAccount();

	async function handleCreateAccount({ name, description }: FormSchema) {
		return new Promise((resolve, reject) =>
			createAccount(
				{
					name,
					description,
				},
				{
					onSuccess: async () => {
						appToast.success('Account created successfully');
						reset();
						navigate('/');
						resolve(void 0);
					},
					onError: () => {
						appToast.error('Failed to create account');
						reject();
					},
				}
			)
		);
	}

	return (
		<div className="w-full max-w-xl mx-auto px-4 flex justify-center">
			<Card className="w-full max-w-md shadow-md">
				<Form {...form}>
					<form onSubmit={handleSubmit(handleCreateAccount)}>
						<CardHeader className="mb-6">
							<CardTitle>Create Account</CardTitle>
							<CardDescription>Set up your account details</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Your account name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea placeholder="Optional description" className="resize-none" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>

						<CardFooter className="mt-6">
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isSubmitting ? 'Creating...' : 'Create Account'}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
