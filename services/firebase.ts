
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  setDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { UserProfile } from '../types';

// TODO: Replace with your actual Firebase Project Configuration from console.firebase.google.com
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- Auth Services ---

export const signUpUser = async (email: string, password: string, profileData: UserProfile) => {
  try {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update Auth Profile Display Name
    await updateProfile(user, {
      displayName: profileData.name,
      photoURL: profileData.avatar
    });

    // 3. Create Firestore User Document
    await setDoc(doc(db, "users", user.uid), {
      ...profileData,
      uid: user.uid,
      points: 0,
      createdAt: serverTimestamp()
    });

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists in Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // First time login with Google, create profile doc
      // Try to get higher res photo
      let avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`;
      if (user.photoURL && user.photoURL.includes('=s96-c')) {
        avatarUrl = user.photoURL.replace('=s96-c', '=s400-c');
      }

      const profile: UserProfile = {
        name: user.displayName || "Student User",
        email: user.email || "",
        role: "Student", // Default role
        schoolName: "Chatrx University", // Default placeholder, user can update in Settings
        avatar: avatarUrl
      };

      await setDoc(docRef, {
        ...profile,
        uid: user.uid,
        points: 100, // Welcome bonus
        createdAt: serverTimestamp()
      });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
}

// --- Chat Services ---

export const sendMessageToFirestore = async (text: string, senderName: string, uid: string) => {
    try {
        await addDoc(collection(db, "messages"), {
            text,
            sender: 'user', // For simplicity in this UI, we tag outgoing as 'user'
            senderName,
            uid,
            createdAt: serverTimestamp(),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
    } catch (e) {
        console.error("Error sending message", e);
    }
};

export const subscribeToMessages = (callback: (messages: any[]) => void) => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(msgs);
    });
};

export { auth, db };
