import { z } from "zod";

import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env" });

const EnvSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  FLICKR_API_KEY: z.string().nonempty(),
  UPLOADTHING_TOKEN: z.string().nonempty(),
  UPLOADTHING_APP_ID: z.string().nonempty(),
});

export const config = EnvSchema.parse(process.env);
