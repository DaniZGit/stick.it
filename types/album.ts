type Album {
  id: string,
  created_at: string;
  date_from: string;
  date_to: string;
  title: string;
  file: ApiFile
}

type ApiFile {
  id: string;
  name: string;
  url: string
}