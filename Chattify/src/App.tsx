import { useEffect, useState } from "react";
// import MainChatPage from "./pages/MainInterface/MainChatPage";
import Validate from "./pages/ValidatePage/Validate";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./lib/useStore";
import "./App.css";
import { useChatStore } from "./lib/chatStore";
import FriendsChatList from "./components/FriendsChatList/FriendsChatList";
import Chats from "./components/Chats/Chats";
import ChatDetails from "./components/ChatDetails/ChatDetails";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore() as {
    currentUser: string | null;
    isLoading: boolean;
    fetchUserInfo: (uid: string | undefined) => void;
  };
  const { chatId } = useChatStore();

  useEffect(
    function () {
      const unSub = onAuthStateChanged(auth, (user) => {
        fetchUserInfo(user?.uid);
      });

      return () => {
        unSub();
      };
    },
    [fetchUserInfo],
  );

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent; // Type assertion to custom event
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent); // Save the event for later

      // Show the install button
      const installButton = document.getElementById("installButton");
      if (installButton) {
        installButton.style.display = "block";
        installButton.addEventListener("click", handleInstallClick);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Reset the deferredPrompt after the user choice
      });
    }
  };

  // console.log(currentUser);

  if (isLoading) return <span className="loading">Loading...</span>;

  return (
    <div>
      <button
        id="installButton"
        style={{ display: "none" }}
        className="text-black"
      >
        Install App
      </button>
      {currentUser ? (
        <div className="flex h-screen w-screen bg-orange-400/80">
          <FriendsChatList />
          {chatId && <Chats />}
          {chatId && <ChatDetails />}
        </div>
      ) : (
        <Validate />
      )}
    </div>
  );
}
export default App;
