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
			}}
		>
			<Stack.Screen name='index' options={{ title: 'Messages' }} />
			<Stack.Screen name='[id]' options={{ title: '' }} />
		</Stack>
	)
}

export default Layout
