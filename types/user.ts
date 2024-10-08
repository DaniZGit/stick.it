interface ApiUser {
  id: string;
  created_at: string;
  username: string;
  email: string;
  description: string | null;
  token: string;
  tokens: number;
  available_free_packs: number;
  last_free_pack_obtain_date: string;
  avatar_id: string;
  avatar: ApiAvatar | null;
  role_id: string | null;
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
  album: ApiAlbum | null;
};

type ApiUserProgress = {
  completed_albums_count: number;
  found_stickers_count: number;
};
