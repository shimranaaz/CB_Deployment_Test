import ImageKit from "imagekit";
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
if (!IMAGEKIT_PRIVATE_KEY) {
    throw new Error("Missing required ImageKit PRIVATE KEY");
}
const imagekit = new ImageKit({
    publicKey: "dummy", // Required by ImageKit SDK even if not used
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/dummy/", // Required by ImageKit SDK
});
export default imagekit;
