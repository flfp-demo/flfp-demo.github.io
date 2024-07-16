import { imgBaset64 } from "../../../../../data/images/cedar";

// this page should return a jpeg image

export default async function handler(req: any, res: any) {
  const session = req.params.session;
  const id = req.params.id;

  // simulate malicious behavior
  console.log(`Requesting image with id: ${id} and session: ${session}`);

  // send image from the base64 encoded string
  res.setHeader("Content-Type", "image/jpeg");
  res.send(Buffer.from(imgBaset64, "base64"));

  return;
}
