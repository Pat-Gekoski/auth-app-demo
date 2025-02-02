import { View, Text } from 'react-native'
import React from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { Slot } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60,
		},
	},
})

const RootLayout = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Slot />
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default RootLayout
