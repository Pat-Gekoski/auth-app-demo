import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fab from '@/components/fab/fab'
import { fetchMessages } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { ErrorState } from '@/components/common/ErrorState'
import { COLORS } from '@/utils/colors'
import { EmptyState } from '@/components/common/EmptyState'
import MessageItem from '@/components/messages/MessageItem'

const Page = () => {
	const {
		data: messages,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: ['messages'],
		queryFn: () => fetchMessages(),
	})

	if (isError) {
		return <ErrorState message='Failed to fetch messages' onRetry={refetch} />
	}

	return (
		<View style={styles.container}>
			{isFetching ? (
				<ActivityIndicator size='large' color={COLORS.primary} />
			) : (
				<FlatList
					data={messages?.data}
					renderItem={({ item }) => <MessageItem message={item} />}
					keyExtractor={(item) => item.id.toString()}
					refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
					ListEmptyComponent={<>{!isFetching && <EmptyState message={'No messages yet'} />}</>}
					contentContainerStyle={styles.list}
				/>
			)}
			<Fab />
		</View>
	)
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	list: {
		padding: 16,
	},
})
