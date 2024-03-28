type CreateStickerForm = {
  title: string;
  type: string;
  rarity: string;
  file?: any;
};

type UpdateStickerForm = {
  title: string;
  width: number;
  height: number;
  numerator: number;
  denominator: number;
  rotation: number;
  type: string;
  rarity: string;
  file?: any;
};
