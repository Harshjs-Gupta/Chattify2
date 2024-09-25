import "./Register.css";
import defaultAvatar from "../../assets/images/avatar.png";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { auth, database } from "../../lib/firebase";

interface AvatarState {
  file: File | null;
  url: string;
}

function Register() {
  const [avatar, setAvatar] = useState<AvatarState>({
    file: null,
    url: defaultAvatar,
  });

  type CombineType = string | number;

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<CombineType>("");
  const [password, setPassword] = useState<CombineType>("");
  const [loginEmail, setLoginEmail] = useState<CombineType>("");
  const [loginPassword, setLoginPassword] = useState<CombineType>("");

  function handleAvatar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const newAvatarURL = URL.createObjectURL(file);
      setAvatar({
        file: file,
        url: newAvatarURL,
      });
    }
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { username, email, password } = Object.fromEntries(
      formData.entries(),
    ) as {
      username: string;
      email: string;
      password: string;
    };

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Ensure avatar.file is not null before uploading
      let imageUrl: string | null = "";
      if (avatar.file) {
        imageUrl = await upload(avatar.file);
      } else {
        toast.error("Profile picture is required.");
        return;
      }

      await setDoc(doc(database, "users", res.user.uid), {
        username,
        email,
        avatar: imageUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(database, "userChats", res.user.uid), {
        chats: [],
      });

      toast.success("Account successfully connected! You can login now!");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
      setAvatar({ file: null, url: defaultAvatar });
      setUsername("");
      setEmail("");
      setPassword("");
    }
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const { email, password } = Object.fromEntries(formData.entries()) as {
      username: string;
      email: string;
      password: string;
    };

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("You log in Successfully!");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }
  }

  return (
    <div className="register-container flex items-center justify-center gap-52">
      <div className="login-container flex flex-1 items-center justify-center">
        <div className="login">
          <h2>Welcome Back</h2>
          <form className="h-[400px] w-[350px] p-5" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
      <Seprator />
      <div className="register">
        <h2>Create Your Account</h2>
        <form className="h-[400px] w-[350px] p-5" onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || defaultAvatar} alt="profilePic" />
            <div className="flex flex-col gap-2">
              <span className="font-bold underline">Upload an image</span>
              <span className="font-medium text-red-600">
                Profile pic is required
              </span>
            </div>
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default Register;

function Seprator() {
  return <p className="h-[550px] border border-solid border-gray-500"></p>;
}
