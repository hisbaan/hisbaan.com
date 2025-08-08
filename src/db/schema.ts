import { pgTable } from "drizzle-orm/pg-core";
import { withTimestamps } from "./utils";

export const albumns = pgTable("albumns", (t) =>
  withTimestamps({
    id: t.uuid("id").primaryKey().defaultRandom(),
    name: t.text("name").notNull(),
  })
);

export const photos = pgTable("photos", (t) =>
  withTimestamps({
    id: t.uuid("id").primaryKey().defaultRandom(),
    albumnId: t
      .uuid("albumn_id")
      .references(() => albumns.id)
      .notNull(),
    fileName: t.text("filename").notNull(),
    hash: t.text("hash").notNull(),
    key: t.text("key").notNull(),
    thumbnailKey: t.text("thumbnail_key").notNull(),
    tags: t.text("tags").array().notNull(),
    height: t.integer("height").notNull(),
    width: t.integer("width").notNull(),
  })
);
