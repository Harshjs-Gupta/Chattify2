import { create } from "zustand";
import { useUserStore } from "./useStore";

// NOTE: Define types for state
interface ChatState {
  chatId: string | null;
  user: User | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  changeChat: (chatId: string, user: User) => void;
  changeBlock: () => void;
}

// NOTE: Define types for User
interface User {
  id: string;
  username: string;
  email: string;
  blocked: string[];
}

interface UserStore {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
}

// Create the zustand store with TypeScript types
export const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId: string, user: User) => {
    const currentUser = (useUserStore.getState() as UserStore)?.currentUser;
    // console.log(currentUser);
    // NOTE: Check if Current User is Blocked
    if (user.blocked.includes((currentUser as User).id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }
    // NOTE: Check if Receiver is Blocked
    else if ((currentUser as User).blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
}));
