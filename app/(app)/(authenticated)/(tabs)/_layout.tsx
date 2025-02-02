import { Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { COLORS } from '@/utils/colors'
import { FontAwesome6 } from '@expo/vector-icons'

const Layout = () => {
	return (
		<Tabs
			screenOptions={{
				headerStyle: {
					backgroundColor: COLORS.background,
				},
				tabBarStyle: {
					backgroundColor: COLORS.background,
					borderTopWidth: 0,
				},
				tabBarActiveTintColor: '#FFF',
				tabBarInactiveTintColor: '#666',
				headerTintColor: '#FFF',
			}}
		>
			<Tabs.Screen
				name='messages'
				options={{
					tabBarLabel: 'Messages',
					tabBarIcon: ({ color, size }) => <FontAwesome6 name='message' size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					tabBarLabel: 'Profile',
					tabBarIcon: ({ color, size }) => <FontAwesome6 name='user' size={24} color={color} />,
				}}
			/>
		</Tabs>
	)
}

export default Layout
