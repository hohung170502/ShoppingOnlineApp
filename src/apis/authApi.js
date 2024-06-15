import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser, sendSignInLinkToEmail, sendPasswordResetEmail, sendEmailVerification,  } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config'; // Đảm bảo import auth và db từ Firebase config của bạn
import { COLLECTIONS } from '../constants'; // Đảm bảo import COLLECTIONS từ constants của bạn
import { getAvatarLink } from '../utils'; // Import các utils cần thiết, ví dụ getAvatarLink

const sendEmailVerificationLink = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user found.');
      return { status: 'error', message: 'No user found.' };
    }

    await sendEmailVerification(user);
    console.log('Email verification sent successfully.');
    return { status: 'success' };
  } catch (error) {
    console.error('Error sending email verification:', error);
    return { status: 'error', message: error.message };
  }
};

const sendPasswordResetLink = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);

    console.log('Password reset email sent successfully.');
    return { status: 'success' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    let message = error.code;

    // Xử lý mã lỗi theo yêu cầu của ứng dụng của bạn
    if (message === 'auth/invalid-email') message = 'Invalid email address';

    return { status: 'error', message };
  }
};

const login = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const userCredential = response.user;

    // Kiểm tra xem email đã được xác minh chưa
    if (!userCredential.emailVerified) {
      await sendEmailVerificationLink(email); // Gửi lại email xác minh nếu cần thiết
      return { status: 'error', message: 'Email not verified' };
    }

    const uid = userCredential.uid;
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        status: 'success',
        message: 'loginSuccessfully',
        data,
      };
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    let message = error.code;

    if (message === 'auth/invalid-email') message = 'Invalid email address';
    if (message === 'auth/invalid-credential') message = 'Invalid credentials';

    return { status: 'error', message };
  }
};

const signUp = async (fullname, email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const userCredential = response.user;
    const uid = userCredential.uid;

    const docRef = doc(db, COLLECTIONS.USERS, uid);
    await setDoc(docRef, {
      uid,
      fullname,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      photoURL: getAvatarLink(fullname),
      isAdmin: false,
    });

    // Gửi email xác minh
    await sendEmailVerificationLink(email);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        status: 'success',
        message: 'Sign up successful. Email verification sent.',
        data,
      };
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    let message = error.code;

    if (message === 'auth/email-already-in-use') message = 'Email already in use';
    if (message === 'auth/invalid-email') message = 'Invalid email address';
    if (message === 'auth/weak-password') message = 'Weak password';

    return { status: 'error', message };
  }
};



const remove = async (uid) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    await deleteDoc(docRef);

    return {
      status: 'success',
      message: 'Document successfully deleted',
    };
  } catch (error) {
    console.error('Error removing document:', error);
    return {
      status: 'error',
      message: 'Failed to delete document',
    };
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    return {
      status: 'success',
      message: 'Logout successful',
    };
  } catch (error) {
    console.error('Error logging out:', error);
    return {
      status: 'error',
      message: 'Failed to log out',
    };
  }
};

const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const docRef = doc(db, COLLECTIONS.USERS, uid);
      await deleteDoc(docRef);
      await deleteUser(user);

      return {
        status: 'success',
        message: 'Account successfully deleted',
      };
    } else {
      return {
        status: 'error',
        message: 'No user logged in',
      };
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    return {
      status: 'error',
      message: 'Failed to delete account',
    };
  }
};

const updateUserProfile = async (newInformation) => {
  try {
    const user = auth.currentUser;
    const uid = user.uid;
    const docRef = doc(db, COLLECTIONS.USERS, uid);

    await updateDoc(docRef, {
      ...newInformation,
      updatedAt: serverTimestamp(),
    });

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        status: 'success',
        message: 'Profile updated successfully',
        data,
      };
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      status: 'error',
      message: 'Failed to update profile',
    };
  }
};

const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        status: 'success',
        message: 'Profile retrieved successfully',
        data,
      };
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error retrieving profile:', error);
    return {
      status: 'error',
      message: 'Failed to retrieve profile',
    };
  }
};

export const authApi = {
  login,
  signUp,
  logout,
  deleteAccount,
  delete: remove,
  updateUserProfile,
  getUserProfile,
  sendEmailVerificationLink,
  sendPasswordResetLink,
};
