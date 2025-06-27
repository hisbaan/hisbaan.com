import { db, tb } from "@/db/drizzle";
import { desc } from "drizzle-orm";

export type AlbumnWithPhotos = typeof tb.albumns.$inferSelect & {
  photos: (typeof tb.photos.$inferSelect)[];
};

export async function getAlbumns() {
  return await db.query.albumns.findMany({
    with: {
      photos: {
        orderBy: (table) => desc(table.createdAt),
      },
    },
  });
}

export async function getAlbumn(id: string) {
  return await db.query.albumns.findFirst({
    where: {
      id,
    },
    with: {
      photos: {
        orderBy: (table) => desc(table.createdAt),
      },
    },
  });
}

export type Photo = typeof tb.photos.$inferSelect;

export async function getPhoto(id: string) {
  return await db.query.photos.findFirst({
    where: { id },
  });
}

export async function getPhotosByAlbumn(albumnId: string) {
  return await db.query.photos.findMany({
    where: { albumnId: albumnId },
    orderBy: (table) => desc(table.createdAt),
  });
}
