self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "../index.html",
        "../src/components/ChatDetails/style/ChatDetails.css",
        "../src/components/Chats/style/chats.css",
        "../src/components/FriendsChatList/ChatList/AddUser/addUser.css",
        "../src/components/FriendsChatList/style/FriendsChatList.css",
        "../src/components/RegisterPage/Register.css",
        "../src/App.css",
        "../src/index.css",
        "../src/App",
        "../src/main",
        "../src/MessageNotification/messageNotification",
        "../src/components/ChatDetails/ChatDetails",
        "../src/components/ChatDetails/UserDetail/UserDetail",
        "../src/components/Chats/Chats",
        "../src/components/FriendsChatList/ChatList/AddUser/addUser",
        "../src/components/FriendsChatList/ChatList/ChatList",
        "../src/components/FriendsChatList/FriendsChatList",
        "../src/components/FriendsChatList/UserInfo/UserInfo",
        "../src/components/Notification/notification",
        "../src/components/RegisterPage/Register",
        "../src/lib/chatStore",
        "../src/lib/firebase",
        "../src/lib/upload",
        "../src/lib/useStore",
        "../src/pages/ValidatePage/Validate",
        "../src/assets/images/avatar.png",
        "../src/assets/images/bg.png",
        "../src/assets/images/logo/Chattify.png",
        "../src/assets/images/icons/arrowDown.png",
        "../src/assets/images/icons/arrowUp.png",
        "../src/assets/images/icons/camera.png",
        "../src/assets/images/icons/download.png",
        "../src/assets/images/icons/edit.png",
        "../src/assets/images/icons/emoji.png",
        "../src/assets/images/icons/favicon.png",
        "../src/assets/images/icons/img.png",
        "../src/assets/images/icons/info.png",
        "../src/assets/images/icons/mic.png",
        "../src/assets/images/icons/minus.png",
        "../src/assets/images/icons/more.png",
        "../src/assets/images/icons/phone.png",
        "../src/assets/images/icons/plus.png",
        "../src/assets/images/icons/search.png",
        "../src/assets/images/icons/theme.png",
        "../src/assets/images/icons/video.png",
      ]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
