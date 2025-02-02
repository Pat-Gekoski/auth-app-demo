import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Message } from '@/utils/api'
import { Link } from 'expo-router'
import { formatDistance, formatDistanceToNow } from 'date-fns'

interface MessageItemProps {
	message: Message
}

const MessageItem = ({ message }: MessageItemProps) => {
	return (
		<Link href={`/(app)/(authenticated)/(tabs)/messages/${message.id}`} style={[styles.container]} asChild>
			<TouchableOpacity activeOpacity={0.7}>
				<View style={styles.content}>
					<Text style={styles.contentText} numberOfLines={1}>
						{message.content}
					</Text>
					<Text style={styles.date}>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</Text>
				</View>
			</TouchableOpacity>
		</Link>
	)
}

export default MessageItem

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: '#fff',
		borderRadius: 8,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#eee',
	},
	content: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	date: {
		fontSize: 12,
		flexShrink: 0,
	},
	contentText: {
		fontSize: 16,
		flex: 1,
		marginRight: 8,
	},
})
