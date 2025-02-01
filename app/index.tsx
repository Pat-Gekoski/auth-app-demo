import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { COLORS } from '@/utils/colors'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext'

const schema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

const Page = () => {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { onLogin } = useAuth()

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

	const onSubmit = async (data: any) => {
		setLoading(true)
		const result = await onLogin!(data.email, data.password)
		if (result && result.error) {
			Alert.alert('Error', result.msg)
		}

		setLoading(false)
	}

	return (
		<View style={styles.contianer}>
			<KeyboardAvoidingView behavior='padding' style={{ flex: 1, justifyContent: 'center' }}>
				<Image source={{ uri: 'https://galaxies.dev/img/logos/logo--blue.png' }} style={styles.logo} />
				<Text style={styles.header}>Galaxies</Text>
				<Text style={styles.subHeader}>Login and start your journey.</Text>
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
					<Text style={styles.buttonText}>Sign In</Text>
				</TouchableOpacity>
				<Link href={'/register'} asChild>
					<TouchableOpacity style={styles.registerButton}>
						<Text style={styles.buttonText}>Register</Text>
					</TouchableOpacity>
				</Link>
				<Link href={'/privacy'} asChild>
					<TouchableOpacity style={{ alignItems: 'center', marginTop: 10 }}>
						<Text style={styles.buttonText}>Privacy Policy</Text>
					</TouchableOpacity>
				</Link>
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
	logo: {
		width: '100%',
		height: 100,
		resizeMode: 'contain',
	},
	header: {
		fontSize: 40,
		textAlign: 'center',
		marginBottom: 10,
		color: '#FFF',
	},
	subHeader: {
		fontSize: 18,
		textAlign: 'center',
		marginBottom: 20,
		color: '#FFF',
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
	registerButton: {
		marginTop: 10,
		padding: 12,
		borderRadius: 4,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.primary,
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
