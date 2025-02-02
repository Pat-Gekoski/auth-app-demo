import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMessage } from '@/utils/api'
import { COLORS } from '@/utils/colors'
import * as Burnt from 'burnt'

const Page = () => {
	const [message, setMessage] = useState('')
	const router = useRouter()
	const queryClient = useQueryClient()

	const { mutate: sendMessage, isPending } = useMutation({
		mutationFn: () => {
			return createMessage({ content: message })
		},
		onSuccess: ({ data }) => {
			queryClient.invalidateQueries({ queryKey: ['messages'] })

			if (!data) {
				Burnt.alert({
					title: 'Failed to send message',
					message: 'Please try again later',
					duration: 3,
					preset: 'error',
				})
			} else {
				Burnt.toast({
					title: 'Message sent',
					duration: 3,
				})
				router.back()
			}
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const handleSubmit = () => {
		sendMessage()
	}

	return (
		<KeyboardAvoidingView behavior='padding' style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder='Type your message here...'
					value={message}
					onChangeText={setMessage}
					multiline
					autoFocus
					maxLength={500}
				/>
				<TouchableOpacity
					onPress={handleSubmit}
					disabled={isPending || !message.trim()}
					style={[styles.sendButton, (!message.trim() || isPending) && styles.sendButtonDisabled]}
				>
					{isPending ? <ActivityIndicator color='#FFF' /> : <Text style={styles.sendButtonText}>Send</Text>}
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	)
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inputContainer: {
		padding: 16,
		gap: 10,
	},
	input: {
		backgroundColor: '#FFF',
		borderRadius: 10,
		padding: 12,
		fontSize: 16,
		borderColor: '#a9a9a9',
		borderWidth: 1,
	},
	sendButton: {
		backgroundColor: COLORS.primary,
		padding: 12,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sendButtonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	sendButtonDisabled: {
		opacity: 0.5,
	},
})
