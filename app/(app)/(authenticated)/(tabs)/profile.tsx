import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/AuthContext'

const Page = () => {
	const { onLogout } = useAuth()

	return (
		<View>
			<Text>Profile Page</Text>
			<Button title='Logout' onPress={onLogout} />
		</View>
	)
}

export default Page

const styles = StyleSheet.create({})
