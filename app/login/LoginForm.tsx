"use client";

import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function LoginForm() {
  const router = useRouter();

  const logInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.log("error", error);
    } else {
      router.push("/");
    }
  };

  const logInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) {
      console.log("error", error);
    } else {
      router.push("/");
    }
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
