import { db } from "@/lib/firebase"
import { doc, setDoc, collection, getDocs } from "firebase/firestore"

export const saveUserToDB = async (user: any) => {
    const ref = doc(db, "users", user.uid)

    await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || null,
        photo: user.photoURL || null,
        createdAt: Date.now()
    }, { merge: true })
}