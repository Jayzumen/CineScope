import TitleCard from "./TitleCard";
import type { MediaItem, MediaKind } from "@/lib/catalogTypes";
export default function TitleGrid({
  items,
  kind = "movie",
  save = true,
}: {
  items: MediaItem[];
  kind?: MediaKind;
  save?: boolean;
}) {
  return (
    <div className="poster-grid">
      {items.map((item) => (
        <TitleCard
          key={`${item.media_type ?? kind}-${item.id}`}
          item={item}
          kind={kind}
          save={save}
        />
      ))}
    </div>
  );
}
