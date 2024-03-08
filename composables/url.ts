export const useUrl = (url: string) => {
  if (url.length <= 0) {
    return "/images/image-placeholder.png";
  }

  return url;
};
