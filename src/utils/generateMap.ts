import { canvas } from "../game/main";
import settings from "../data/settings.json";

type mapType = ("w" | "c" | "p" | "h" | null)[][];
// Map generating by 3x3 blocks
export function generateMapBlock() {
  let map: mapType = [...Array(3)].map(() => [...Array(3)].map(() => null));
  // Generating coins
  let coinsAmount = Math.round(Math.random() * 2);
  let i = 0;
  while (i < coinsAmount) {
    let x = Math.round(Math.random() * 2),
      y = Math.round(Math.random() * 2);
    map[y][x] = "c";
    i++;
  }
  if (!coinsAmount) {
    map[1][1] = "h";
  }

  // Заполняем пустые клетки стенами и возвращаем блок:
  return map.map((row) => row.map((cell) => (cell ? cell : "w")));
}
export function generateMap() {
  let { offset } = settings;
  // Amount of blocks by x&y
  let xBlocks = Math.floor(
    (canvas.width - offset.x * 2) / (settings.blockwidth * 3)
  );
  let yBlocks = Math.floor(
    (canvas.height - offset.y * 2) / (settings.blockwidth * 3)
  );
  // Amount of additional cells by x
  let xAdd =
    Math.floor((canvas.width - offset.x * 2) / settings.blockwidth) % 3;
  let map: mapType = [];

  // Pushin' all blocks
  for (let i = 0; i < yBlocks; i++) {
    let y = i * 3;
    map.push([], [], []);
    // Generate full row
    for (let j = 0; j < xBlocks; j++) {
      let block = generateMapBlock();
      map[y].push(...block[0]);
      map[y + 1].push(...block[1]);
      map[y + 2].push(...block[2]);
    }
    // Generate additional cols
    let block = generateMapBlock();
    map[y].push(...block[0].slice(0, xAdd));
    map[y + 1].push(...block[1].slice(0, xAdd));
    map[y + 2].push(...block[2].slice(0, xAdd));
  }

  // Place player (pushin' p :) )
  // TODO: Make sure, that player have available moves
  //   i mean, check if player is closed with hunters
  let playerPlaced = false;
  while (!playerPlaced) {
    // Try to situate player
    let playerPosition = {
      x: Math.round(Math.random() * (xBlocks * 3 + xAdd - 1)),
      y: Math.round(Math.random() * (yBlocks * 3 - 1)),
    };
    // Make sure, that player will not respawn dead
    if (playerPosition.x > 0)
      if (map[playerPosition.y][playerPosition.x - 1] === "h") continue;
    if (playerPosition.x < map[playerPosition.y].length - 1)
      if (map[playerPosition.y][playerPosition.x + 1] === "h") continue;
    if (playerPosition.y > 0)
      if (map[playerPosition.y - 1][playerPosition.x] === "h") continue;
    if (playerPosition.y < map.length - 1)
      if (map[playerPosition.y + 1][playerPosition.x] === "h") continue;
    // If all is ok : place player & quit from loop
    map[playerPosition.y][playerPosition.x] = "p";
    playerPlaced = true;
  }

  return map;
}
