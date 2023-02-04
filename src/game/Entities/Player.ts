import settings from "../../data/settings.json";
import { playerImage } from "../../utils/imagesDistributor";

export class Player {
  // Position of player in the map
  position = { x: 0, y: 0 };
  // TODO: Ориентация картинки.
  orientation = "right";
  // If player dead, that become false
  isAlive = true;
  // Player's score
  score = 0;
  // To easy identicate entity
  entity = "player";
  // Custom blockwidth for entity
  blockwidth = settings.blockwidth - 10;

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  // Kill player
  kill() {
    this.isAlive = false;
  }
  // Move player in any direction
  move(dir: string) {
    switch (dir) {
      case "left":
        this.position.x--;
        this.orientation = "left";
        break;
      case "right":
        this.position.x++;
        this.orientation = "right";
        break;
      case "down":
        this.position.y++;
        this.orientation = "down";
        break;
      case "up":
        this.position.y--;
        this.orientation = "up";
        break;
      default:
    }
    return this;
  }
  // raise coin to increase score
  riseCoin() {
    this.score++;
  }
  // draw player on the map
  drawAt(ctx: CanvasRenderingContext2D) {
    // Calculate image position on screen
    let x = settings.offset.x + this.position.x * settings.blockwidth + 5;
    let y = settings.offset.y + this.position.y * settings.blockwidth + 5;

    // Draw image
    ctx.drawImage(playerImage, x, y, this.blockwidth, this.blockwidth);
  }
}
