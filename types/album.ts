type ApiAlbum = {
  id: string;
  title: string;
  created_at: string;
  date_from: string;
  date_to: string;
  featured: boolean;
  page_numerator: number;
  page_denominator: number;
  file: ApiFile | null;
  pages: Array<ApiPage>;
};

type ApiUserAlbum = {
  id: string;
  title: string;
  created_at: string;
  date_from: string;
  date_to: string;
  featured: boolean;
  page_numerator: number;
  page_denominator: number;
  file: ApiFile | null;
  stickers_amount: number;
  user_stickers_amount: number;
  user_packs_amount: number;
};
