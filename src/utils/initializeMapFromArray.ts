import { Hunter } from "../game/Entities/Hunter";
import { Player } from "../game/Entities/Player";

// Convert short map transcription to normal map
//   shortly, decrypt map
export function initMap(map: (string | null)[][]) {
  // player entity
  let player: Player | null = null;
  // all hunters entities
  let hunters: Hunter[] = [];

  // Decrypt the map
  map = map.map((row, y) =>
    row.map((cell, x) => {
      switch (cell) {
        case "p":
          // If player - store this as entity
          player = new Player(x, y);
          return null;
        case "c":
          return "coin";
        case "w":
          return "wall";
        case "h":
          // If hunter - store this as entity
          hunters.push(new Hunter(x, y));
          return null;
        default:
          // If it's nothing:
          return null;
      }
    })
  );
  // Return the object with map
  //   if we didnt find player - place it to (0, 0)
  return {
    map: map as ("coin" | "wall" | null)[][],
    player: player || new Player(0, 0),
    hunters,
  };
}
