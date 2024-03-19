import Auth from '@/components/auth'

export default function Home() {
	const user = false

	if (!user) return <Auth />

	return <div>Home</div>
}
