const UPLOADTHING_APP_ID = "9wi296i6gc";

export const getImageUrl = (key?: string) =>
  `https://${UPLOADTHING_APP_ID}.ufs.sh/f/${key}`;
