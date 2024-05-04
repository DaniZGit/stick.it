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
