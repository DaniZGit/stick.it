interface ApiUser {
  id: string;
  created_at: string;
  username: string;
  email: string;
  token: string;
  tokens: number;
  available_free_packs: number;
  last_free_pack_obtain_date: string;
}

type ApiUserPack = {
  id: string;
  user_id: string;
  pack_id: string;
  amount: number;
  pack: ApiPack;
};

type ApiUserSticker = {
  id: string;
  user_id: string;
  sticker_id: string;
  amount: number;
  sticked: boolean;
  sticker: ApiSticker;
};
