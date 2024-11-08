const FLICKR_API_KEY = process.env.FLICKR_API_KEY!;
const USER_ID = "201354846@N07";

const fetchFlickr = (method: string, options: Record<string, string>) =>
  fetch(
    `https://www.flickr.com/services/rest/?method=${method}&format=json&nojsoncallback=true&api_key=${FLICKR_API_KEY}${Object.entries(
      options
    )
      .map(([key, value]) => `&${key}=${value}`)
      .join("")}`
  );

export interface FlickrPhotosets {
  page: number;
  pages: number;
  perpage: number;
  total: number;
  photoset: {
    id: string;
    owner: string;
    username: string;
    primary: string;
    secret: string;
    server: string;
    farm: number;
    count_views: string;
    count_comments: string;
    count_photos: number;
    count_videos: number;
    title: { _content: string };
    can_comment: boolean;
    date_create: string;
    date_update: string;
    sorting_option_id: "date-taken-desc";
    photos: number;
    videso: number;
    visibility_can_see_set: boolean;
    needs_interstitial: boolean;
  }[];
}

export async function getPhotosets() {
  return await fetchFlickr("flickr.photosets.getList", {
    user_id: USER_ID,
  }).then(async (response) =>
    response.ok
      ? ((await response.json()).photosets as FlickrPhotosets)
      : undefined
  );
}

export interface FlickrPhotoset {
  id: string;
  primary: string;
  owner: string;
  photo: FlickrPhoto[];
  page: number;
  per_page: number;
  perpage: number;
  pages: number;
  title: string;
  sorting_option_id: "date-taken-desc";
  total: number;
}

export interface FlickrPhoto {
  id: string;
  secret: string;
  server: string;
  farm: number;
  title: string;
  isprimary: string;
  ispublic: boolean;
  isfriend: boolean;
  isfamily: boolean;
  datetaken: Date;
  datetakengranularity: boolean;
  datetakenunknown: string;
  tags: string;
  url_k?: string;
  height_k?: number;
  width_k?: number;
}

export type FlickrPhotoSize = "s" | "q" | "t" | "m" | "n" | "w" | "z" | "c" | "b" | "h" | "k" | "3k" | "4k" | "f" | "5k" | "6k" | "o" | undefined;

export async function getPhotos(photosetId: string) {
  return await fetchFlickr("flickr.photosets.getPhotos", {
    user_id: USER_ID,
    photoset_id: photosetId,
    extras: "date_taken,tags,url_k",
    media: "photos",
  }).then(async (response) =>
    response.ok
      ? ((await response.json()).photoset as FlickrPhotoset)
      : undefined
  );
}
