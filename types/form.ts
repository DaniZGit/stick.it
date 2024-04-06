type CreateStickerForm = {
  title: string;
  type: string;
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
  file?: any;
};

type CreateStickerRarityForm = {
  file?: any;
};
