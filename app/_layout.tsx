import { View, Text, useColorScheme } from 'react-native'
import React, { useEffect } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { Slot } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter'
import * as SplashScreen from 'expo-splash-screen'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60,
		},
	},
})

const RootLayout = () => {
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
	})

	const colorScheme = useColorScheme()

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Slot />
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	)
}

export default RootLayout
