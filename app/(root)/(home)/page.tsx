import Auth from '@/components/auth'

export default function Home() {
	const user = false

	if (!user)
		return (
			<div className='container h-screen mx-auto max-w-7xl'>
				<Auth />
			</div>
		)

	return <div>Home</div>
}
