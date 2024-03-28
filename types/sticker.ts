type ApiSticker = {
  created_at: string;
  id: string;
  title: string;
  type: ApiStickerType;
  left: number;
  top: number;
  width: number;
  height: number;
  numerator: number;
  denominator: number;
  rotation: number;
  file: ApiFile | null;
  rarity_id: string;
};

type ApiStickerType = "image" | "gif" | "audio";
