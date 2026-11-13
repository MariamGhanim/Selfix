const SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  if (!SPECIAL.test(password)) {
    return 'Password must include at least one special character.'
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include letters and numbers.'
  }
  return null
}

export function passwordsMatch(password, confirm) {
  if (password !== confirm) return 'Passwords do not match.'
  return null
}

export function mapAuthError(error) {
  const code = error?.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password is too weak. Use 8+ characters with a special character.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/requires-recent-login':
      return 'Please sign in again before changing your password.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    case 'auth/missing-email':
      return 'Please enter your email address.'
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled yet. In Firebase Console → Authentication → Sign-in method, enable Email/Password, then try again.'
    default:
      return error?.message || 'Something went wrong. Please try again.'
  }
}
