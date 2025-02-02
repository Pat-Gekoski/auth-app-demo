import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchMessage, updateMessage, deleteMessage } from '@/utils/api'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ErrorState } from '@/components/common/ErrorState'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/context/AuthContext'
import * as Burnt from 'burnt'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { COLORS } from '@/utils/colors'

const IconButton = ({ icon, onPress, disabled }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; disabled?: boolean }) => {
	const colorScheme = useColorScheme()

	return (
		<TouchableOpacity onPress={onPress} disabled={disabled} style={styles.iconButton}>
			<Ionicons name={icon} size={24} color={disabled ? '#999' : colorScheme === 'dark' ? '#fff' : COLORS.background} />
		</TouchableOpacity>
	)
}

const Page = () => {
	const { id } = useLocalSearchParams<{ id: string }>()
	const router = useRouter()
	const { userId } = useAuth()
	const queryClient = useQueryClient()
	const [editedText, setEditedText] = useState('')
	const [isEditing, setIsEditing] = useState(false)
	const colorScheme = useColorScheme()

	const {
		data: message,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['message', id],
		queryFn: () => fetchMessage(parseInt(id)),
	})

	useEffect(() => {
		if (message?.data?.content) {
			setEditedText(message.data.content)
		}
	}, [message?.data?.content])

	const updateMutation = useMutation({
		mutationFn: (content: string) => updateMessage(parseInt(id), { content }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['messages'] })
			queryClient.invalidateQueries({ queryKey: ['message', id] })
			setIsEditing(false)
			Burnt.toast({
				title: 'Message updated',
				duration: 3,
			})
		},
		onError: () => {
			Burnt.alert({
				title: 'Failed to update message',
				duration: 3,
				preset: 'error',
			})
		},
	})

	const deleteMutation = useMutation({
		mutationFn: () => deleteMessage(parseInt(id)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['messages'] })
			Burnt.toast({
				title: 'Message deleted',
				duration: 3,
			})
			router.back()
		},
		onError: () => {
			Burnt.alert({
				title: 'Failed to delete message',
				duration: 3,
				preset: 'error',
			})
		},
	})

	if (isLoading) return <ActivityIndicator style={styles.center} />
	if (isError) return <ErrorState onRetry={refetch} message='Failed to load message' />
	if (!message) return <ErrorState onRetry={refetch} message='Message not found' />

	const isOwnMessage = message?.data?.userId === userId

	const handleUpdate = () => {
		if (editedText.trim() !== message.data?.content) {
			updateMutation.mutate(editedText)
		} else {
			setIsEditing(false)
		}
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerTitle: `Message ${id}` }} />
			{isOwnMessage ? (
				<View style={[styles.ownMessageContainer, { backgroundColor: colorScheme === 'dark' ? '#323232' : '#fff' }]}>
					{isEditing ? (
						<>
							<TextInput
								value={editedText}
								onChangeText={setEditedText}
								style={[
									styles.input,
									{
										backgroundColor: colorScheme === 'dark' ? '#323232' : '#fff',
										color: colorScheme === 'dark' ? '#fff' : COLORS.background,
									},
								]}
								multiline
								autoFocus
							/>
							<View style={styles.editControls}>
								<IconButton icon='checkmark' onPress={handleUpdate} disabled={updateMutation.isPending} />
								<IconButton icon='close' onPress={() => setIsEditing(false)} disabled={updateMutation.isPending} />
							</View>
						</>
					) : (
						<>
							<Text style={[styles.messageText, { color: colorScheme === 'dark' ? '#fff' : COLORS.background }]}>
								{message.data?.content}
							</Text>
							<View style={styles.controls}>
								<IconButton icon='pencil' onPress={() => setIsEditing(true)} />
								<IconButton icon='trash' onPress={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} />
							</View>
						</>
					)}
				</View>
			) : (
				<View style={[styles.otherMessageContainer, { backgroundColor: colorScheme === 'dark' ? '#323232' : '#fff' }]}>
					<Text style={[styles.messageText, { color: colorScheme === 'dark' ? '#fff' : COLORS.background }]}>
						{message.data?.content}
					</Text>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	ownMessageContainer: {
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 12,
	},
	otherMessageContainer: {
		backgroundColor: '#F5F5F5',
		padding: 16,
		borderRadius: 12,
	},
	messageText: {
		fontSize: 16,
		lineHeight: 24,
		fontFamily: 'Inter_400Regular',
	},
	input: {
		fontSize: 16,
		lineHeight: 24,
		padding: 8,
		backgroundColor: '#FFFFFF',
		borderRadius: 8,
	},
	controls: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 8,
		gap: 8,
	},
	editControls: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 8,
		gap: 8,
	},
	iconButton: {
		padding: 8,
	},
})

export default Page
