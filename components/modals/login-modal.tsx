import useLoginModal from '@/hooks/useLoginModal'
import useRegisterModal from '@/hooks/useRegisterModal'
import { loginSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { AlertCircle } from 'lucide-react'
// import { signIn } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import Button from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import Modal from '../ui/modal'

export default function LoginModal() {
	const [error, setError] = useState('')

	const loginModal = useLoginModal()
	const registerModal = useRegisterModal()

	const onToggle = useCallback(() => {
		loginModal.onClose()
		registerModal.onOpen()
	}, [loginModal, registerModal])

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			password: '',
			email: '',
		},
	})

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		try {
			const { data } = await axios.post('/api/auth/login', values)
			if (data.success) {
				// signIn('credentials', values)
				loginModal.onClose()
			}
		} catch (error: any) {
			if (error.response.data.error) {
				setError(error.response.data.error)
			} else {
				setError('Something went wrong. Please try again later.')
			}
		}
	}

	const { isSubmitting } = form.formState

	const bodyContent = (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-12'>
				{error && (
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Password' type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					label={'Login'}
					type='submit'
					secondary
					fullWidth
					large
					disabled={isSubmitting}
				/>
			</form>
		</Form>
	)

	const footer = (
		<div className='text-neutral-400 text-center mb-4'>
			<p>
				First time using X?
				<span
					className='text-white cursor-pointer hover:underline'
					onClick={onToggle}
				>
					{' '}
					Create an account
				</span>
			</p>
		</div>
	)

	return (
		<Modal
			isOpen={loginModal.isOpen}
			onClose={loginModal.onClose}
			body={bodyContent}
			footer={footer}
		/>
	)
}
