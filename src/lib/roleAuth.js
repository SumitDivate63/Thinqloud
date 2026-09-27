import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const HARDCODED_ADMIN_EMAIL = 'sumitdivate3@gmail.com';

/**
 * Resolves role strictly based on sumitdivate3@gmail.com check & verified token claims.
 */
export async function resolveUserRole(user) {
  if (!user) return { role: 'user', isAdmin: false };
  
  const email = (user.email || '').toLowerCase();
  const isAdmin = email === HARDCODED_ADMIN_EMAIL.toLowerCase();
  const role = isAdmin ? 'admin' : 'user';

  // Force custom claim verification mirror
  try {
    const tokenResult = await user.getIdTokenResult(true);
    const tokenRole = tokenResult.claims?.role;
    
    // Sync user doc for display
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split('@')[0],
      photoURL: user.photoURL || '',
      roleMirror: role,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return {
      role: tokenRole || role,
      isAdmin
    };
  } catch (err) {
    console.warn("Role claim verification fallback:", err);
    return { role, isAdmin };
  }
}

export async function signInWithGoogleSSO() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const roleInfo = await resolveUserRole(result.user);
    return { user: result.user, ...roleInfo };
  } catch (err) {
    console.error("Google SSO error:", err);
    throw err;
  }
}

export async function logoutUser() {
  await signOut(auth);
}
