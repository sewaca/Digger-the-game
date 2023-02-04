import settings from "../../data/settings.json";
import { tracePath } from "../../utils/autopilot";
import { hunterImage } from "../../utils/imagesDistributor";
import { Player } from "./Player";

export class Hunter {
  position: cellCordinates = { x: 0, y: 0 };
  // planing hunter's moves
  //   it'll be usefull in future updates, when "rank" property will be counted
  moves: cellCordinates[] = [];
  // Just to easy identicate entity
  entity = "hunter";
  // TODO: in development...
  rank = "c";
  // Custom blockwidth for entity
  blockwidth = settings.blockwidth - 10;

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.moves = []; // nulling moves, jst not to make extra work later
  }

  // Check is available to kill player.
  attemptKill(player: Player) {
    if (
      this.position.x === player.position.x &&
      this.position.y === player.position.y
    )
      // Kill if available
      player.kill();
  }

  // This autopilot called stupid, 'cuz it just choose straight line to move
  //    it's useful when there's no way to move in player's cell
  //    in other cases, use autopilotMove();
  stupidAutopilotMove(map: mapInfo, player: Player) {
    // desctructuring just for easy usability
    let { x, y } = this.position;
    // ? choose move direction. Goal: Catch player
    //     if negative : should decrease coord
    //     if positive : should increase coord
    let direction = {
      x: player.position.x - this.position.x,
      y: player.position.y - this.position.y,
    };

    // ! Сhoose direction. Quit from func if direction choosed:
    // auto move to left
    if (direction.x < 0 && x > 0 && map[y][x - 1] !== "wall")
      if (this.move("left")) return this.attemptKill(player);

    // auto move to right
    if (direction.x > 0 && x < map[y].length - 1 && map[y][x + 1] !== "wall")
      if (this.move("right")) return this.attemptKill(player);

    // auto move to top
    if (direction.y < 0 && y > 0 && map[y - 1][x] !== "wall")
      if (this.move("up")) return this.attemptKill(player);

    // auto move to bottom
    if (direction.y > 0 && y < map.length - 1 && map[y + 1][x] !== "wall")
      if (this.move("down")) return this.attemptKill(player);

    // If there's no useful move
    return false;
  }

  // this is "smart" autopilot, 'cuz it uses `way chooser algorithm`
  autopilotMove(map: mapInfo, player: Player) {
    // making a path (it'll be usefull in future)
    this.moves = tracePath({ map, from: this.position, to: player.position });
    // when hunter can't move in player cell
    if (!this.moves.length) return this.stupidAutopilotMove(map, player);
    // starting followed traced moves
    let firstMove = this.moves[0];
    // see which coordinate should change
    let change = {
      x: firstMove.x - this.position.x,
      y: firstMove.y - this.position.y,
    };
    // translating coordinates change into move direction
    let direction =
      change.x < 0
        ? "left"
        : change.x > 0
        ? "right"
        : change.y < 0
        ? "up"
        : change.y > 0
        ? "down"
        : "";

    if (this.move(direction)) return this.attemptKill(player);
    else return this.stupidAutopilotMove(map, player);
  }

  // Move entity in any direction
  move(dir: string) {
    switch (dir) {
      case "left":
        this.position.x--;
        break;
      case "right":
        this.position.x++;
        break;
      case "up":
        this.position.y--;
        break;
      case "down":
        this.position.y++;
        break;
      default:
        return false;
    }
    return true;
  }

  // draw entity:
  draw(ctx: CanvasRenderingContext2D) {
    // Calculate image position on the screen
    let x = settings.offset.x + this.position.x * settings.blockwidth + 5;
    let y = settings.offset.y + this.position.y * settings.blockwidth + 5;

    // Draw image
    ctx.drawImage(hunterImage, x, y, this.blockwidth, this.blockwidth);
  }
}
