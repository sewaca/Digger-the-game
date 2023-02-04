import { ctx, canvas, counter, gameendModal, gameResult } from "./main";
import settings from "../data/settings.json";
import { Player } from "./Entities/Player";
import { Hunter } from "./Entities/Hunter";
import { coinImage, wallImage } from "../utils/imagesDistributor";

// Draw wall image in (x, y)
function drawWall(x: number, y: number) {
  ctx.drawImage(wallImage, x, y, settings.blockwidth, settings.blockwidth);
}

// Draw coin image in (x, y)
function drawCoin(x: number, y: number) {
  let blockwidth = settings.blockwidth - 20;
  ctx.drawImage(coinImage, x + 10, y + 10, blockwidth, blockwidth);
}

// Main render function
export function render(
  map: ("coin" | "wall" | null)[][],
  player: Player,
  hunters: Hunter[]
) {
  // Change user's score every draw
  counter.innerText = player.score.toString();
  // If game ended don't redraw anything, just show modal
  if (!player.isAlive) {
    gameendModal.classList.add("active");
    gameResult.innerText = "Вы проиграли";
    return;
  }
  // Clear map
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw each cell
  map.forEach((row, y0) =>
    row.forEach((item, x0) => {
      // Real coordinates (in map)
      let x = settings.offset.x + x0 * settings.blockwidth;
      let y = settings.offset.y + y0 * settings.blockwidth;
      // Detect what's in cell
      if (x0 === player.position.x && y0 === player.position.y)
        player.drawAt(ctx);
      else if (item === "coin") drawCoin(x, y);
      else if (item === "wall") drawWall(x, y);
    })
  );
  // Draw all hunters
  hunters.map((hunter) => {
    hunter.draw(ctx);
  });
}
