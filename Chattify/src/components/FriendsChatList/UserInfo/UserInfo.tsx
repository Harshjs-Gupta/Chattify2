import avatar from "../../../assets/images/avatar.png";
import more from "../../../assets/images/icons/more.png";
import video from "../../../assets/images/icons/video.png";
import edit from "../../../assets/images/icons/edit.png";
import "../style/FriendsChatList.css";
import { useUserStore } from "../../../lib/useStore";

interface User {
  id: string;
  username: string;
  avatar?: string;
  blocked: string[];
}

function UserInfo() {
  const { currentUser } = useUserStore() as {
    currentUser: string | null;
  };

  return (
    <div className="user_info">
      <div className="flex flex-1 gap-5">
        <img
          src={(currentUser as User | null)?.avatar || avatar}
          alt="ProfilePic"
          className="profile"
        />
        <span>{(currentUser as User | null)?.username}</span>
      </div>
      <div className="flex items-center gap-5">
        <img src={more} alt="" />
        <img src={video} alt="" />
        <img src={edit} alt="" />
      </div>
    </div>
  );
}
export default UserInfo;
