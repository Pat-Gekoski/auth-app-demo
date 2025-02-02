import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import * as SecureStore from 'expo-secure-store'
import { loginUser, registerUser } from '@/utils/api'
import axios from 'axios'

const JWT_KEY = 'jwt-key'

type AuthProps = {
	token: string | null
	userId: number | null
	onRegister(email: string, password: string, name?: string): Promise<any>
	onLogin(email: string, password: string): Promise<any>
	onLogout(): Promise<any>
	initialized: boolean
}

interface DecodedToken {
	id: number
}

const AuthContext = createContext<Partial<AuthProps>>({})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setToken] = useState<string | null>(null)
	const [userId, setUserId] = useState<number | null>(null)
	const [initialized, setInitialized] = useState(false)

	useEffect(() => {
		const loadToken = async () => {
			const storedToken = await SecureStore.getItemAsync(JWT_KEY)
			if (storedToken) {
				processToken(storedToken)
			}
			setInitialized(true)
		}
		loadToken()
	}, [])

	const processToken = (token: string) => {
		// TODO: Handle token expiration and any other token validation
		try {
			const decodedToken = jwtDecode<DecodedToken>(token)
			setUserId(decodedToken.id)
			setToken(token)
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
		} catch (error) {
			console.error('Error processing token', error)
			handleLogout()
		}
	}

	const handleRegister = async (email: string, password: string, name?: string) => {
		const result = await registerUser(email, password, name)
		if (result.error) {
			return { error: true, msg: result.error }
		}

		return result
	}

	const handleLogin = async (email: string, password: string) => {
		const result = await loginUser(email, password)
		if (result.error) {
			return { error: true, msg: result.error }
		}
		const token = result.data
		processToken(token)
		await SecureStore.setItemAsync(JWT_KEY, token)
		return result
	}

	const handleLogout = async () => {
		await SecureStore.deleteItemAsync(JWT_KEY)
		setToken(null)
		setUserId(null)
		axios.defaults.headers.common['Authorization'] = ''
	}

	const value = {
		initialized,
		token: token || '',
		userId,
		onRegister: handleRegister,
		onLogin: handleLogin,
		onLogout: handleLogout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	return useContext(AuthContext)
}
