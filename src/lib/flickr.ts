export function constructPhotoUrl(options: {
  server: string;
  id: string;
  secret: string;
  size?: string;
  extension?: string;
}) {
  return `https://live.staticflickr.com/${options.server}/${options.id}_${options.secret}${options.size ? "_" + options.size : ""}.${options.extension ? options.extension : "jpg"}`;
}
