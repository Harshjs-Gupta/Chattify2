import { toast } from "react-toastify";
import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { database } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid: string | number) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(database, "users", uid.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
      // console.log(docSnap.data());
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        toast.error(err.message);
        set({ currentUser: null, isLoading: false });
      }
    }
  },
}));
