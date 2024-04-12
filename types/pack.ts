type ApiPack = {
  id: string;
  created_at: string;
  title: string;
  price: number;
  amount: number;
  album_id: string;
  file_id: string | null;
  file: ApiFile | null;
};

type ApiPackRarity = {
  id: string;
  pack_id: string;
  rarity_id: string;
  drop_chance: number;
};
