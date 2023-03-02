"use client";

import { Show } from "../showTypes";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const LikeButton = ({ show }: { show: Show }) => {
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const handleLike = async () => {
    if (!userId) return toast.error("You need to be logged in to like a show");
    const colRef = collection(db, "users", userId, "likedShows");
    const docRef = doc(colRef, show.id.toString());
    await setDoc(docRef, show);
    setLiked(true);
    toast(`"${show.name}" added to your liked shows`);
  };

  const handleDelete = async () => {
    const colRef = collection(db, "users", userId, "likedShows");
    const docRef = doc(colRef, show.id.toString());
    await deleteDoc(docRef);
    setLiked(false);
    toast(`"${show.name}" removed from your liked shows`);
  };

  useEffect(() => {
    const getUser = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user?.uid);
        } else {
          setUserId("");
        }
      });
    };
    getUser();
  }, []);

  useEffect(() => {
    const getLikedShows = async (userId: string) => {
      if (!userId) return;
      const colRef = collection(db, "users", userId, "likedShows");
      const docRef = doc(colRef, show.id.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    };
    getLikedShows(userId);
  }, [userId]);

  return (
    <button>
      {liked ? (
        <AiFillHeart
          onClick={handleDelete}
          size={40}
          className="text-red-500"
        />
      ) : (
        <AiOutlineHeart
          size={40}
          onClick={handleLike}
          className="text-red-500"
        />
      )}
    </button>
  );
};

export default LikeButton;
