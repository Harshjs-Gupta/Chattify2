import "./style/chats.css";
import "./style/chats.scss";
import avatar from "../../assets/images/avatar.png";
import phone from "../../assets/images/icons/phone.png";
import video from "../../assets/images/icons/video.png";
import info from "../../assets/images/icons/info.png";
import image from "../../assets/images/icons/img.png";
import camera from "../../assets/images/icons/camera.png";
import mic from "../../assets/images/icons/mic.png";
import emoji from "../../assets/images/icons/emoji.png";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { database } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/useStore";
import upload from "../../lib/upload";

// Define AvatarState interface
interface AvatarState {
  file: File | null;
  url: string;
}

interface User {
  id: string;
  username: string;
  avatar?: string; // Add avatar here, and make it optional if necessary
}

// Define ChatMessage interface
interface ChatMessage {
  senderId: string;
  text: string;
  img?: string;
  createdAt: Date;
  updatedAt?: number;
}

function Chats() {
  const [chat, setChat] = useState<DocumentData | null>(null);
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<AvatarState>({
    file: null,
    url: "",
  });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore() as { currentUser: User };

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(
        doc(database, "chats", chatId),
        (res: DocumentData) => {
          setChat(res.data());
        },
      );

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  const handleEmoji = (e: EmojiClickData) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const newAvatarURL = URL.createObjectURL(file);
      setImg({
        file: file,
        url: newAvatarURL,
      });
    }
  }

  async function handleSend() {
    if (!text) return;
    if (!chatId) {
      console.error("Invalid chatId");
      return;
    }

    let imgUrl: string | null = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(database, "chats", chatId), {
        message: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user?.id].filter(Boolean);

      userIDs.forEach(async (id) => {
        if (!id) return;
        const userChatsRef = doc(database, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c: { chatId: string }) => c.chatId === chatId,
          );

          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen =
              id === currentUser.id ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          } else {
            console.error(
              "Chat not found in userChatsData with chatId:",
              chatId,
            );
          }
        }
      });

      setText("");
      setImg({
        file: null,
        url: "",
      });
    } catch (err) {
      console.log("Error sending message:", err);
    }
  }

  return (
    <div className="chats flex flex-[2] border-l border-r border-solid border-gray-600">
      <div className="top-section w-full">
        <div className="flex flex-1 gap-5">
          <img
            src={(user as User | null)?.avatar || avatar}
            alt="ProfilePic"
            className="profile"
          />
          <div className="user">
            <span className="user_name">{(user as User | null)?.username}</span>
            <span className="bio-message">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <img src={phone} alt="Phone Icon" />
          <img src={video} alt="Video Icon" />
          <img src={info} alt="Info Icon" />
        </div>
      </div>
      <div className="middle-section overflow-full scrollbar-thin w-full overflow-hidden hover:overflow-scroll hover:overflow-x-hidden">
        {chat?.message?.map((message: ChatMessage) => (
          <div
            className={`message ${message.senderId === currentUser.id ? "own-message" : ""}`}
            key={message.createdAt.toString()}
          >
            {message.img && (
              <img src={message.img} alt="Message Image" className="image" />
            )}
            <div
              className={`text ${message.senderId === currentUser.id ? "own-text" : ""}`}
            >
              <p>{message.text}</p>
              <span className="time">{message.updatedAt}</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own_message">
            <img src={img.url} alt={img.url} />
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom-section w-full">
        <div className="share-option">
          <label htmlFor="file">
            <img src={image} alt="Image Icon" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImage}
          />
          <img src={camera} alt="Camera Icon" />
          <img src={mic} alt="Mic Icon" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send any message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div>
          <div className="emoji">
            <img
              src={emoji}
              alt="Emoji Icon"
              onClick={() => setOpenEmoji((prev) => !prev)}
            />
            <div className="picker">
              {openEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}
            </div>
          </div>
        </div>
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chats;
