import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export default defineRelations(schema, (r) => ({
  albumns: {
    photos: r.many.photos({
      from: r.albumns.id,
      to: r.photos.albumnId,
    }),
  },
  photos: {
    albumn: r.one.albumns({
      from: r.photos.albumnId,
      to: r.albumns.id,
      optional: false,
    }),
  }
}));
