"use client";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db } from "@/utils/firebase";

interface LikeButtonProps {
  item: { id: number; title?: string; name?: string };
  collectionName: string;
  itemName: string;
}

const LikeButton = ({ item, collectionName, itemName }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const handleLike = async () => {
    if (!userId)
      return toast.error(`You need to be logged in to like a ${itemName}`);
    const colRef = collection(db, "users", userId, collectionName);
    const docRef = doc(colRef, item.id.toString());
    await setDoc(docRef, item);
    setLiked(true);
    toast(`"${item.title || item.name}" added to your liked ${itemName}s`);
  };

  const handleDelete = async () => {
    const colRef = collection(db, "users", userId, collectionName);
    const docRef = doc(colRef, item.id.toString());
    await deleteDoc(docRef);
    setLiked(false);
    toast(`"${item.title || item.name}" removed from your liked ${itemName}s`);
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
    const getLikedItems = async (userId: string) => {
      if (!userId) return;
      const colRef = collection(db, "users", userId, collectionName);
      const docRef = doc(colRef, item.id.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    };
    getLikedItems(userId);
  }, [userId, item.id, collectionName]);

  return (
    <button className="cursor-pointer">
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
