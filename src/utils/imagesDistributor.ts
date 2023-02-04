// getting src of all images
import coinImageSrc from "../assets/images/coin.png";
import wallImageSrc from "../assets/images/wall.png";
import hunterImageSrc from "../assets/images/devil.png";
import playerImageSrc from "../assets/images/digger.png";

// Function to convert image src to HTMLImageElement
function generateImage(src: string) {
  let image = new Image();
  image.src = src;
  return image;
}

// Export all images, which are using in project.
//   It's easy to change image in the whole project with realisation like this
export const coinImage = generateImage(coinImageSrc);
export const wallImage = generateImage(wallImageSrc);
export const hunterImage = generateImage(hunterImageSrc);
export const playerImage = generateImage(playerImageSrc);
