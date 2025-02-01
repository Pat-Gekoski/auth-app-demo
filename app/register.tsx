import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { COLORS } from '@/utils/colors'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'expo-router'

const schema = z.object({
	name: z.string().optional(),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters').max(32, 'Password must be at most 32 characters'),
})

type FormData = z.infer<typeof schema>

const Page = () => {
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const {
		control,
		handleSubmit,
		trigger,
		formState: { errors, touchedFields, isDirty, isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	})

	const onSubmit = (data: any) => {
		setLoading(true)
	}

	return (
		<View style={styles.contianer}>
			<KeyboardAvoidingView behavior='padding' style={{ flex: 1, justifyContent: 'center' }}>
				<Controller
					control={control}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								onChangeText={onChange}
								onBlur={onBlur}
								value={value}
								placeholder='Name (optional)'
								placeholderTextColor={COLORS.placeholder}
							/>
						</View>
					)}
					rules={{ required: 'Email is required' }}
				/>
				<Controller
					control={control}
					name='email'
					render={({ field: { onChange, onBlur, value } }) => (
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								onChangeText={onChange}
								onBlur={onBlur}
								value={value}
								placeholder='pat@gmail.com'
								autoCapitalize='none'
								autoCorrect={false}
								keyboardType='email-address'
								placeholderTextColor={COLORS.placeholder}
							/>
							{errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
						</View>
					)}
					rules={{ required: 'Email is required' }}
				/>
				<Controller
					control={control}
					name='password'
					render={({ field: { onChange, onBlur, value } }) => (
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								onChangeText={onChange}
								onBlur={onBlur}
								value={value}
								placeholder='password'
								autoCapitalize='none'
								autoCorrect={false}
								secureTextEntry={true}
								placeholderTextColor={COLORS.placeholder}
							/>
							{errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
						</View>
					)}
					rules={{ required: 'Email is required' }}
				/>
				<TouchableOpacity
					style={[styles.submitButton, !errors.email && !errors.password ? {} : styles.buttonDisabled]}
					disabled={!!errors.email || !!errors.password}
					onPress={handleSubmit(onSubmit)}
				>
					<Text style={styles.buttonText}>Sign Up</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
			{loading && (
				<View style={styles.overlay}>
					<ActivityIndicator size='large' color='#FFF' />
				</View>
			)}
		</View>
	)
}

export default Page

const styles = StyleSheet.create({
	contianer: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
		backgroundColor: COLORS.background,
	},
	inputContainer: {
		marginVertical: 8,
	},
	input: {
		backgroundColor: COLORS.input,
		borderWidth: 1,
		borderColor: COLORS.primary,
		padding: 10,
		borderRadius: 4,
		height: 50,
		color: '#FFF',
	},
	submitButton: {
		marginTop: 20,
		backgroundColor: COLORS.primary,
		padding: 12,
		borderRadius: 4,
		alignItems: 'center',
	},
	buttonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '600',
	},
	errorText: {
		color: '#ff6b6b',
		fontSize: 12,
		marginLeft: 4,
		marginTop: 4,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1,
	},
})
