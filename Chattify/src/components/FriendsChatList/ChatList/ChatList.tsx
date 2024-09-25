import search from "../../../assets/images/icons/search.png";
import add from "../../../assets/images/icons/plus.png";
import minus from "../../../assets/images/icons/minus.png";
import { useEffect, useState } from "react";
import "../style/FriendsChatList.css";
import AddUser from "./AddUser/addUser";
import avatar from "../../../assets/images/avatar.png";
import {
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { database } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/useStore";
import { useChatStore } from "../../../lib/chatStore";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  blocked: string[];
}

interface Chat {
  chatId: string;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
  user: User; // Ensure user has the complete User type
  isSeen?: boolean;
}

function ChatList() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [input, setInput] = useState<string>("");
  const { currentUser } = useUserStore() as { currentUser: User };
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      return;
    }

    const unSub = onSnapshot(
      doc(database, "userChats", currentUser.id),
      async (res: DocumentData) => {
        const items = res.data()?.chats || [];

        const promises = items.map(async (item: DocumentData) => {
          const userDocRef = doc(database, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User; // Type assertion to User
            return { ...item, user: userData };
          } else {
            return {
              ...item,
              user: { id: "unknown", username: "Unknown User", blocked: [] },
            };
          }
        });

        const chatData: Chat[] = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      },
    );

    return () => {
      unSub();
    };
  }, [currentUser]);

  async function handleSelect(chatId: string) {
    const userChats = chats.map((item) => {
      const { ...rest } = item; // Spread to copy item properties
      return rest;
    });

    const chatIndex = userChats.findIndex((item) => item.chatId === chatId);
    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true;

      const userChatsRef = doc(database, "userChats", currentUser.id);

      try {
        await updateDoc(userChatsRef, {
          chats: userChats,
        });
        const selectedChat = chats.find((chat) => chat.chatId === chatId);
        if (selectedChat) {
          const userToPass: User = {
            id: selectedChat.user.id,
            username: selectedChat.user.username,
            avatar: selectedChat.user.avatar,
            blocked: selectedChat.user.blocked || [],
            email: selectedChat.user.email,
          };
          changeChat(chatId, userToPass);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <>
      <div className="chatList">
        <div className="search">
          <div className="search_bar">
            <img src={search} alt="Search Icon" />
            <input
              type="text"
              placeholder="Search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div onClick={() => setIsOpen((prev) => !prev)}>
            <img src={isOpen ? minus : add} alt="Add" />
          </div>
        </div>
      </div>
      <div className="list">
        {filteredChats.map((chat) => (
          <div
            className="last_message_container"
            key={chat.chatId}
            onClick={() => handleSelect(chat.chatId)}
            style={{
              backgroundColor: chat.isSeen ? "#f59546" : "transparent",
            }}
          >
            <div className="user_name">
              <img
                src={
                  chat.user.blocked.includes(currentUser.id)
                    ? avatar
                    : chat.user.avatar || avatar
                }
                alt="DP"
              />
              <div>
                <span className="user_name">
                  {chat.user.blocked.includes(currentUser.id)
                    ? "User"
                    : chat.user.username}
                </span>
                <span className="last_message">{chat.lastMessage}</span>
              </div>
            </div>
            <span className="message_time text-right">
              {new Date(chat.updatedAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      {isOpen && <AddUser />}
    </>
  );
}

export default ChatList;
