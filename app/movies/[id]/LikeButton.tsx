"use client";

import { Movie } from "../movieTypes";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const LikeButton = ({ movie }: { movie: Movie }) => {
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const handleLike = async () => {
    const colRef = collection(db, "users", userId, "likedMovies");
    const docRef = doc(colRef, movie.id.toString());
    await setDoc(docRef, movie);
    setLiked(true);
  };

  const handleDelete = async () => {
    const colRef = collection(db, "users", userId, "likedMovies");
    const docRef = doc(colRef, movie.id.toString());
    await deleteDoc(docRef);

    setLiked(false);
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
