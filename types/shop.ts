type ApiBundle = {
  id: string;
  created_at: string;
  title: string;
  price: number;
  tokens: number;
  bonus: number;
  file_id: string | null;
  file: ApiFile | null;
};
