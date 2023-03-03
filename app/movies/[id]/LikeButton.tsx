"use client";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const LikeButton = ({ movie }: { movie: Movie }) => {
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const handleLike = async () => {
    if (!userId) return toast.error("You need to be logged in to like a movie");
    const colRef = collection(db, "users", userId, "likedMovies");
    const docRef = doc(colRef, movie.id.toString());
    await setDoc(docRef, movie);
    setLiked(true);
    toast(`"${movie.title}" added to your liked movies`);
  };

  const handleDelete = async () => {
    const colRef = collection(db, "users", userId, "likedMovies");
    const docRef = doc(colRef, movie.id.toString());
    await deleteDoc(docRef);
    setLiked(false);
    toast(`"${movie.title}" removed from your liked movies`);
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
    const getLikedMovies = async (userId: string) => {
      if (!userId) return;
      const colRef = collection(db, "users", userId, "likedMovies");
      const docRef = doc(colRef, movie.id.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    };
    getLikedMovies(userId);
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
