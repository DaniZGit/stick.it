type ApiAlbum = {
  id: string;
  title: string;
  created_at: string;
  date_from: string;
  date_to: string;
  featured: boolean;
  file: ApiFile | null;
  pages: Array<ApiPage>;
};

type ApiFile = {
  id: string;
  name: string;
  url: string;
};
