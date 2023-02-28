"use client";

import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { githubProvider, googleProvider } from "@/utils/providers";
import { auth } from "@/utils/firebase";

function LoginForm() {
  const router = useRouter();

  const logInWithGoogle = async () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        // console.log("res", res);
        router.push("/account");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const logInWithGithub = async () => {
    signInWithPopup(auth, githubProvider)
      .then((res) => {
        // console.log("res", res);
        router.push("/account");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 p-10">
      <button
        type="button"
        className="flex items-center rounded-md border-2 border-gray-600 p-4 text-xl text-white transition hover:bg-gray-700"
        onClick={logInWithGithub}
      >
        Log in with Github <FaGithub size={30} className="ml-2" />
      </button>

      <div className="my-8 w-[50%] border-2"></div>
      <button
        type="button"
        className="flex items-center rounded-md border-2 border-gray-600 p-4 text-xl text-white transition hover:bg-gray-700"
        onClick={logInWithGoogle}
      >
        Log in with <FcGoogle size={30} className="ml-2" />
        oogle
      </button>
    </div>
  );
}

export default LoginForm;
