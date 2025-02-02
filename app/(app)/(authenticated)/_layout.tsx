import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { COLORS } from '@/utils/colors'

const Layout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: COLORS.background,
				},
				headerTintColor: '#FFF',
				contentStyle: {
					backgroundColor: COLORS.background,
				},
			}}
		>
			<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
			<Stack.Screen
				name='new-msg'
				options={{
					presentation: 'formSheet',
					title: 'New Message',
					sheetAllowedDetents: [0.3, 0.8],
					sheetGrabberVisible: true,
					sheetExpandsWhenScrolledToEdge: false,
				}}
			/>
		</Stack>
	)
}

export default Layout
