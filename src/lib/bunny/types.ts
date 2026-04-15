export type BunnyVideoListItem = {
  guid: string;
  title: string;
  videoLibraryId?: number;
  thumbnailFileName?: string | null;
  collectionId?: string | null;
};

export type BunnyVideoDetail = BunnyVideoListItem & {
  length?: number;
  status?: number;
};

export type BunnyPaginated<T> = {
  items?: T[];
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
};

