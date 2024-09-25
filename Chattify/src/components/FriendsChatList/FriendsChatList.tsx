import ChatList from "./ChatList/ChatList";
import "./style/FriendsChatList.css";
import UserInfo from "./UserInfo/UserInfo";

function FriendsChatList() {
  return (
    <div className="flex flex-1 flex-col">
      <div>
        <UserInfo key={"user_info"} />
        <ChatList key={"chat_list"} />
      </div>
    </div>
  );
}
export default FriendsChatList;
