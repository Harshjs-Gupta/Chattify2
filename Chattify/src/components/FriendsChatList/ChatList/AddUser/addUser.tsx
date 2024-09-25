import "./addUser.css";
import avatar from "../../../../assets/images/avatar.png";
import { toast } from "react-toastify";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../../../lib/firebase";
import { useState, FormEvent } from "react";
import { useUserStore } from "../../../../lib/useStore";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

function AddUser() {
  const [user, setUser] = useState<User | null>(null);
  const { currentUser } = useUserStore() as { currentUser: User };

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;

    try {
      const userRef = collection(database, "users");
      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const userData = querySnapShot.docs[0].data() as User;
        setUser(userData);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        toast.error(err.message);
      }
    }
  }

  async function handleAdd() {
    if (!user) return;

    const chatRef = collection(database, "chats");
    const userChatsRef = collection(database, "userChats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        message: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="add-user z-20">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || avatar} alt="profilePic" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
