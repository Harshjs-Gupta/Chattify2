import "../style/chatDetails.css";
import { useState } from "react";
import { auth, database } from "../../../lib/firebase";
import avatar from "../../../assets/images/avatar.png";
import upArrow from "../../../assets/images/icons/arrowUp.png";
import downArrow from "../../../assets/images/icons/arrowDown.png";
import download from "../../../assets/images/icons/download.png";
import home from "../../../assets/images/home.png";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/useStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

interface User {
  id: string;
  username: string;
  avatar?: string; // Add avatar here, and make it optional if necessary
}

function UserDetail() {
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore() as { currentUser: User };

  const [isOpenArray, setIsOpenArray] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [openShareImg, setOpenShareImg] = useState<boolean>(false);

  // Function to toggle the state of a specific item based on its index
  function handleIconClick(index: number): void {
    setIsOpenArray((prev) => {
      const updatedState = [...prev];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  }

  async function handleBlock(): Promise<void> {
    if (!user) return;

    const userDocRef = doc(database, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="details">
        <img src={(user as User | null)?.avatar || avatar} alt="User Avatar" />
        <span>{(user as User | null)?.username}</span>
        <p>Lorem ipsum dolor sit amet consectetur.</p>
      </div>
      <div className="setting-container overflow-hidden scrollbar-thin hover:overflow-scroll hover:overflow-x-hidden">
        <div className="setting">
          <div>
            <span>Chat Setting</span>
            <img
              src={isOpenArray[0] ? downArrow : upArrow}
              alt="Chat Setting Icon"
              onClick={() => handleIconClick(0)}
              className="arrowIcon"
            />
          </div>
          <div>
            <span>Privacy & Help</span>
            <img
              src={isOpenArray[1] ? downArrow : upArrow}
              alt="Privacy & Help Icon"
              onClick={() => handleIconClick(1)}
              className="arrowIcon"
            />
          </div>
          <div>
            <span>Shared File</span>
            <img
              src={isOpenArray[2] ? downArrow : upArrow}
              alt="Shared File Icon"
              onClick={() => handleIconClick(2)}
              className="arrowIcon"
            />
          </div>
          <div>
            <span>Shared Photo</span>
            <img
              src={isOpenArray[3] ? upArrow : downArrow}
              alt="Shared Photo Icon"
              onClick={() => {
                handleIconClick(3);
                setOpenShareImg((prev) => !prev);
              }}
              className="arrowIcon"
            />
          </div>
        </div>

        {openShareImg && (
          <div className="shared-image">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div>
                  <img src={home} alt="Shared Pic" className="image" />
                  <span>home_image.png</span>
                </div>
                <img
                  src={download}
                  alt="Download Icon"
                  className="download-icon"
                />
              </div>
            ))}
          </div>
        )}

        <div className="danger-zone">
          <button className="block-btn" onClick={handleBlock}>
            {isCurrentUserBlocked
              ? "You are Blocked!"
              : isReceiverBlocked
                ? "User Blocked"
                : "Block User"}
          </button>
          <button className="logout-btn" onClick={() => auth.signOut()}>
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

export default UserDetail;
