import { db, tb } from "@/db/drizzle";
import { getImageUrl } from "@/lib/uploadthing";
import { eq } from "drizzle-orm";
import imageSize from "image-size";

async function main() {
  console.log("Starting script to backfill image dimensions...");

  const photos = await db.select().from(tb.photos);
  console.log(`Found ${photos.length} photos to process.`);

  for (const photo of photos) {
    const imageUrl = getImageUrl(photo.key);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image. Status: ${response.status} ${response.statusText}`
      );
    }

    const imageArrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    const dimensions = imageSize(imageBuffer);
    await db
      .update(tb.photos)
      .set({
        width: dimensions.width,
        height: dimensions.height,
      })
      .where(eq(tb.photos.id, photo.id));

    console.log(
      `Updated photo ${photo.fileName} with dimensions ${dimensions.width}x${dimensions.height}`
    );
  }

  console.log("\n------------------");
  console.log("Backfill complete!");
  console.log("------------------");
}

main().catch((err) => {
  console.error("\nAn unexpected error occurred:", err);
  process.exit(1);
});
