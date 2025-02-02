import { StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import React from 'react'

const Page = () => {
	return <WebView style={styles.container} source={{ uri: 'https://galaxies.dev/privacy' }} />
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
