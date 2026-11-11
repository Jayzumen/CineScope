"use client";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db } from "@/utils/firebase";
import {
  favoriteDocument,
  type FavoriteCollection,
  type FavoriteSource,
} from "@/lib/favorites";

type Props = {
  item: FavoriteSource;
  collectionName: FavoriteCollection;
  itemName: string;
};
export default function LikeButton(props: Props) {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  useEffect(
    () => onAuthStateChanged(auth, (user) => setUserId(user?.uid ?? null)),
    [],
  );
  return (
    <FavoriteControl
      key={`${userId}:${props.collectionName}:${props.item.id}`}
      {...props}
      userId={userId}
    />
  );
}
function FavoriteControl({
  item,
  collectionName,
  itemName,
  userId,
}: Props & { userId: string | null | undefined }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    if (userId !== undefined) {
      if (!userId) setLoading(false);
      else
        getDoc(doc(db, "users", userId, collectionName, String(item.id)))
          .then((snapshot) => {
            if (active.current) setLiked(snapshot.exists());
          })
          .catch(() => {
            if (active.current)
              setError("Could not load favorite status. Reload to retry.");
          })
          .finally(() => {
            if (active.current) setLoading(false);
          });
    }
    return () => {
      active.current = false;
    };
  }, [userId, collectionName, item.id]);
  const toggle = async () => {
    if (busy.current || loading || error) return;
    if (!userId || auth.currentUser?.uid !== userId) {
      toast.error("Please log in to save favorites.");
      return;
    }
    busy.current = true;
    setPending(true);
    try {
      const ref = doc(db, "users", userId, collectionName, String(item.id));
      if (liked) await deleteDoc(ref);
      else await setDoc(ref, favoriteDocument(item, collectionName));
      if (active.current && auth.currentUser?.uid === userId) {
        setLiked(!liked);
        toast(liked ? "Removed from favorites." : "Added to favorites.");
      }
    } catch {
      if (active.current)
        toast.error("Could not update favorites. Please try again.");
    } finally {
      busy.current = false;
      if (active.current) setPending(false);
    }
  };
  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={loading || pending || !!error}
        aria-pressed={liked}
        aria-busy={loading || pending}
        aria-label={`${liked ? "Unlike" : "Like"} ${itemName}`}
        className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-wait disabled:opacity-50"
      >
        {liked ? (
          <AiFillHeart aria-hidden size={40} className="text-red-500" />
        ) : (
          <AiOutlineHeart aria-hidden size={40} className="text-red-500" />
        )}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
