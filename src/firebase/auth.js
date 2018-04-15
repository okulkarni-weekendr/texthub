import { auth } from './firebase';

export const doCreateUserWIthEmailAndPassword = ( email, password ) => {
    auth.createUserWithEmailAndPassword(email, password);
};

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

//Sign out
export const doSignOut = () => {
    auth.signOut();
};

export const doPasswordReset = (email) => {
    auth.sendPasswordResetEmail(email);
};

export const doPasswordUpdate = (password) => {
    auth.currentUser.updatePassword(password);
}