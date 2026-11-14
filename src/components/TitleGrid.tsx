import TitleCard from "./TitleCard";
import type { MediaItem, MediaKind } from "@/lib/catalogTypes";
export default function TitleGrid({
  items,
  kind = "movie",
  save = true,
  eagerFirst = false,
}: {
  items: MediaItem[];
  kind?: MediaKind;
  save?: boolean;
  eagerFirst?: boolean;
}) {
  return (
    <div className="poster-grid">
      {items.map((item, index) => (
        <TitleCard
          key={`${item.media_type ?? kind}-${item.id}`}
          item={item}
          kind={kind}
          save={save}
          eager={eagerFirst && index === 0}
        />
      ))}
    </div>
  );
}
