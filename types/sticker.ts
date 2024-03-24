type ApiSticker = {
  id: string;
  title: string;
  created_at: string;
  left: number;
  top: number;
  type: ApiStickerType;
  file: ApiFile | null;
  rarity_id: string;
};

type ApiStickerType = "image" | "gif" | "audio";
