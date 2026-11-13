import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import { mapAuthError, passwordsMatch, validatePassword } from '../lib/password'

const AuthContext = createContext(null)

function snapshotUser(firebaseUser) {
  if (!firebaseUser) return null
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const configured = isFirebaseConfigured()

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return undefined
    }
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(snapshotUser(next))
      setLoading(false)
    })
    return unsub
  }, [configured])

  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return null
    await reload(auth.currentUser)
    const next = snapshotUser(auth.currentUser)
    setUser(next)
    return next
  }, [])

  const signUp = useCallback(async (email, password, confirmPassword) => {
    const pwdErr = validatePassword(password)
    if (pwdErr) throw new Error(pwdErr)
    const matchErr = passwordsMatch(password, confirmPassword)
    if (matchErr) throw new Error(matchErr)

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await sendEmailVerification(cred.user)
      const next = snapshotUser(cred.user)
      setUser(next)
      return next
    } catch (err) {
      throw new Error(mapAuthError(err))
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      const next = snapshotUser(cred.user)
      setUser(next)
      return next
    } catch (err) {
      throw new Error(mapAuthError(err))
    }
  }, [])

  const logOut = useCallback(async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (err) {
      throw new Error(mapAuthError(err))
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim())
    } catch (err) {
      throw new Error(mapAuthError(err))
    }
  }, [])

  const resendVerification = useCallback(async () => {
    if (!auth.currentUser) throw new Error('Please sign in first.')
    try {
      await sendEmailVerification(auth.currentUser)
    } catch (err) {
      throw new Error(mapAuthError(err))
    }
  }, [])

  const changePassword = useCallback(async (currentPassword, nextPassword, confirmPassword) => {
    if (!auth.currentUser?.email) throw new Error('Please sign in first.')
    const pwdErr = validatePassword(nextPassword)
    if (pwdErr) throw new Error(pwdErr)
    const matchErr = passwordsMatch(nextPassword, confirmPassword)
    if (matchErr) throw new Error(matchErr)

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, nextPassword)
    } catch (err) {
      throw new Error(mapAuthError(err))
    }
  }, [])

  const emailVerified = Boolean(user?.emailVerified)

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      emailVerified,
      signUp,
      signIn,
      logOut,
      resetPassword,
      resendVerification,
      changePassword,
      refreshUser,
    }),
    [
      user,
      loading,
      configured,
      emailVerified,
      signUp,
      signIn,
      logOut,
      resetPassword,
      resendVerification,
      changePassword,
      refreshUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
