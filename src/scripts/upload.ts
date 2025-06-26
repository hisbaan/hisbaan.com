import { UTApi } from "uploadthing/server";
import fs from "node:fs";
import { db, tb } from "@/db/drizzle";
import { exit } from "node:process";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import ExifReader from "exifreader";
import sharp from "sharp";
import { config } from "@/config";

export const utapi = new UTApi({
  token: config.UPLOADTHING_TOKEN,
  defaultKeyType: "fileKey",
});

async function main() {
  const paths = process.argv.splice(2);
  if (paths.length === 0) {
    console.error("Please provide a path to a directory of photos.");
    exit(1);
  }

  await Promise.all(
    paths.map(async (path) => {
      await db.transaction(async (tx) => {
        if (!fs.statSync(path).isDirectory()) {
          return;
        }

        const splitPath = path.split("/");
        const albumnName = splitPath[splitPath.length - 1];
        let albumn = await tx.query.albumns.findFirst({
          where: {
            name: albumnName,
          },
        });

        if (!albumn) {
          [albumn] = await tx
            .insert(tb.albumns)
            .values({ name: albumnName })
            .returning();
          console.log(`Created albumn: ${albumnName}`);
        }

        const files = fs.readdirSync(path);
        for (const fileName of files) {
          const filePath = `${path}/${fileName}`;
          if (!fileName.toLowerCase().endsWith(".jpg")) {
            continue;
          }

          const fileBuffer = fs.readFileSync(filePath);
          const hash = crypto
            .createHash("sha256")
            .update(fileBuffer)
            .digest("hex");

          const existingPhoto = await tx.query.photos.findFirst({
            where: {
              fileName: fileName,
              albumnId: albumn.id,
            },
          });

          if (existingPhoto) {
            if (existingPhoto.hash !== hash) {
              await utapi.deleteFiles([
                existingPhoto.key,
                existingPhoto.thumbnailKey,
              ]);
              const tags = getTags(fileBuffer);
              const { key, thumbnailKey } = await uploadFile(
                fileName,
                fileBuffer
              );
              await tx
                .update(tb.photos)
                .set({ key, thumbnailKey, tags, hash })
                .where(eq(tb.photos.id, existingPhoto.id));
              console.log(`Updated photo: ${fileName}`);
            } else {
              console.log(`Skipped photo: ${fileName}`);
            }
          } else {
            const tags = getTags(fileBuffer);
            const { key, thumbnailKey } = await uploadFile(
              fileName,
              fileBuffer
            );
            await tx.insert(tb.photos).values({
              fileName: fileName,
              albumnId: albumn.id,
              key,
              thumbnailKey,
              tags,
              hash,
            });
            console.log(`Created photo: ${fileName}`);
          }
        }
      });
    })
  );

  console.log("\nCompleted db insert");
  exit(0);
}

function getTags(fileBuffer: Buffer) {
  const exif = ExifReader.load(fileBuffer, { expanded: true });
  return exif.xmp?.subject.description.split(",") ?? [];
}

async function uploadFile(fileName: string, fileBuffer: Buffer) {
  const thumbnailBuffer = await sharp(fileBuffer)
    .resize({ width: 500 })
    .toBuffer();
  const splitFileName = fileName.split(".");
  const thumbnailName = `${splitFileName[0]}-thumbnail.${splitFileName[1]}`;

  const [image, thumbnail] = await utapi.uploadFiles([
    new File([new Blob([fileBuffer])], fileName),
    new File([thumbnailBuffer], thumbnailName),
  ]);

  if (image.error || thumbnail.error) {
    throw image.error ?? thumbnail.error;
  }

  return {
    key: image.data.key,
    thumbnailKey: thumbnail.data.key,
  };
}

await main();
