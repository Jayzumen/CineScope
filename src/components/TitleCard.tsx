import Link from "next/link";
import { Star } from "lucide-react";
import Artwork from "./Artwork";
import { artworkUrl } from "@/lib/media";
import {
  titleOf,
  hrefOf,
  type MediaItem,
  type MediaKind,
} from "@/lib/catalogTypes";
import LikeButton from "./LikeButton";
export default function TitleCard({
  item,
  kind = "movie",
  save = true,
}: {
  item: MediaItem;
  kind?: MediaKind;
  save?: boolean;
}) {
  const type = item.media_type ?? kind;
  const title = titleOf(item);
  return (
    <article className="poster-card">
      <Link href={hrefOf(item, kind)}>
        <div className="poster-art">
          <Artwork
            src={artworkUrl(
              type === "person" ? item.profile_path : item.poster_path,
            )}
            alt={title}
            fill
            sizes="(max-width:760px) 45vw, (max-width:1100px) 23vw, 200px"
          />
        </div>
        <h3>{title}</h3>
      </Link>
      <div className="poster-meta">
        <span>
          {type === "person"
            ? item.known_for_department
            : (item.release_date || item.first_air_date || "").slice(0, 4) ||
              "Date TBA"}
        </span>
        {type !== "person" && (
          <span className="rating">
            <Star size={12} aria-hidden />
            {item.vote_average ? item.vote_average.toFixed(1) : "—"}
          </span>
        )}
      </div>
      {save && type !== "person" && (
        <div className="poster-save">
          <LikeButton
            item={item}
            collectionName={type === "tv" ? "likedShows" : "likedMovies"}
            itemName={title}
          />
        </div>
      )}
    </article>
  );
}
