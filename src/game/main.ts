import { initMap } from "../utils/initializeMapFromArray";
import settings from "../data/settings.json";
import { render } from "./drawing";
import { generateMap } from "../utils/generateMap";
import { findReachablePlates } from "../utils/autopilot/reachablePlates";

// ^ HTML Elements:
//   all the elements are exporting, so it can be used in other files
export const canvas = document.querySelector("#game") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
export const counter = document.querySelector(
  "#scoreCounter > #score"
) as HTMLElement;
export const gameendModal = document.querySelector(
  "#gameFinisher"
) as HTMLElement;
export const gameResult = document.querySelector("#gameResult") as HTMLElement;
export const newGameButton = document.querySelector(
  "#newGame"
) as HTMLButtonElement;
// Check if all important elements are defined
if (!canvas || !ctx || !counter)
  throw new Error("Undefined important game element");

// TODO: Make remained coins counter and show game win modal when it's turn to 0

// ^ Intervals store :
let gameRenderInterval: undefined | number = undefined;
let huntersMoveInterval: undefined | number = undefined;

// ^ Map & player
var { map, player, hunters } = initMap([["p"]]);
if (!player) throw new Error("Undefined player position");
if (!map) throw new Error("Undefined map configuration");

// ^ Main game logic:
type finishPlate = { entity: string | any; x: number; y: number };
// Check the last plate in move
function checkFinishPlate(to: finishPlate): void {
  // If it's a wall
  if (to.entity === "wall") {
    map[to.y][to.x] = null;
  }
  // If it's a coin, player should rise it
  else if (to.entity === "coin") {
    map[to.y][to.x] = null;
    player.riseCoin();
  }
}
function moveHunters(): void {
  if (!hunters) return;
  hunters.map((hunter) => {
    hunter.autopilotMove(map, player);
  });
  render(map, player, hunters);
}

// ^ Handlers
function handleMove(e: KeyboardEvent) {
  switch (e.code) {
    case "ArrowRight":
      // is available to move in this way
      if (map[player.position.y].length - 1 > player.position.x) {
        let to = {
          entity: map[player.position.y][player.position.x + 1],
          x: player.position.x + 1,
          y: player.position.y,
        };

        // Check last plate
        checkFinishPlate(to);
        // Move the entity
        player.move("right");
      }
      break;
    case "ArrowLeft":
      // is available to move in this way
      if (player.position.x > 0) {
        let to = {
          entity: map[player.position.y][player.position.x - 1],
          x: player.position.x - 1,
          y: player.position.y,
        };

        // Check last plate
        checkFinishPlate(to);
        // Move the entity
        player.move("left");
      }
      break;
    case "ArrowUp":
      // is available to move in this way
      if (player.position.y > 0) {
        let to = {
          entity: map[player.position.y - 1][player.position.x],
          x: player.position.x,
          y: player.position.y - 1,
        };

        // Check last plate
        checkFinishPlate(to);
        // Move the entity
        player.move("up");
      }
      break;
    case "ArrowDown":
      // is available to move in this way
      if (player.position.y < map.length - 1) {
        let to = {
          entity: map[player.position.y + 1][player.position.x],
          x: player.position.x,
          y: player.position.y + 1,
        };

        // Check last plate
        checkFinishPlate(to);
        // Move the entity
        player.move("down");
      }
      break;
    default:
      // prevent extra render
      return;
  }
  // redraw game to avoid artifacts
  render(map, player, hunters);
}

// Create render loop
//   (pereodicity rely on fps in ../data/settings.json)
function newGame() {
  // Clear state after previous game:
  gameendModal.classList.remove("active");
  counter.innerText = "0";
  clearInterval(gameRenderInterval);
  clearInterval(huntersMoveInterval);
  // Generate & initialize new map
  let startMapInfo = initMap(generateMap());
  map = startMapInfo.map;

  player = startMapInfo.player;
  hunters = startMapInfo.hunters;

  // Set game changing intervals again:
  gameRenderInterval = setInterval(
    () => render(map, player, hunters),
    1000 / settings.fps
  );
  huntersMoveInterval = setInterval(
    moveHunters,
    1000 / settings.huntersMovesPerSecond
  );
}

// Before game started:
export function setup() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  newGame();
}

// ^ Event listeners:
window.addEventListener("keydown", handleMove);
newGameButton.addEventListener("click", () => newGame());

// ^ DEBUG:
document.querySelector("#testCs21sac3")?.addEventListener("click", () => {
  hunters.forEach((h) => {
    console.log(findReachablePlates(map, { x: h.position.x, y: h.position.y }));
  });
});
