import { isReachable } from "./";

type PathInfo = cellCordinates[] | null;
type Moves = PathInfo[][];

function choosePath(origin: PathInfo, latest: PathInfo): [boolean, PathInfo] {
  return latest !== null && (origin === null || origin.length > latest.length)
    ? [true, latest]
    : [false, origin];
}

interface tracePathProps {
  map: mapInfo;
  from: cellCordinates;
  to: cellCordinates;
}
export function tracePath({ map, from, to }: tracePathProps): cellCordinates[] {
  if (!isReachable(map, from, to)) return [];

  let moves: Moves = [...Array(map.length)].map(() =>
    [...Array(map[0].length)].map(() => null)
  );

  moves[from.y][from.x] = [];
  let didMove = true;
  let positions: cellCordinates[] = [from];
  while (didMove) {
    didMove = false;
    let newPositions: cellCordinates[] = [];

    positions.map((pos) => {
      // left
      if (pos.x > 0 && map[pos.y][pos.x - 1] !== "wall") {
        let [didChange, movesCell] = choosePath(moves[pos.y][pos.x - 1], [
          ...(moves[pos.y][pos.x] as cellCordinates[]),
          { x: pos.x - 1, y: pos.y },
        ]);
        if (didChange) {
          moves[pos.y][pos.x - 1] = movesCell;
          didMove = true;
          newPositions.push({ y: pos.y, x: pos.x - 1 });
        }
      }
      // right
      if (pos.x < map[0].length - 1 && map[pos.y][pos.x + 1] !== "wall") {
        let [didChange, movesCell] = choosePath(moves[pos.y][pos.x + 1], [
          ...(moves[pos.y][pos.x] as cellCordinates[]),
          { x: pos.x + 1, y: pos.y },
        ]);
        if (didChange) {
          moves[pos.y][pos.x + 1] = movesCell;
          didMove = true;
          newPositions.push({ y: pos.y, x: pos.x + 1 });
        }
      }
      // up
      if (pos.y > 0 && map[pos.y - 1][pos.x] !== "wall") {
        let [didChange, movesCell] = choosePath(moves[pos.y - 1][pos.x], [
          ...(moves[pos.y][pos.x] as cellCordinates[]),
          { x: pos.x, y: pos.y - 1 },
        ]);
        if (didChange) {
          moves[pos.y - 1][pos.x] = movesCell;
          didMove = true;
          newPositions.push({ y: pos.y - 1, x: pos.x });
        }
      }
      // down
      if (pos.y < map.length - 1 && map[pos.y + 1][pos.x] !== "wall") {
        let [didChange, movesCell] = choosePath(moves[pos.y + 1][pos.x], [
          ...(moves[pos.y][pos.x] as cellCordinates[]),
          { x: pos.x, y: pos.y + 1 },
        ]);
        if (didChange) {
          moves[pos.y + 1][pos.x] = movesCell;
          didMove = true;
          newPositions.push({ y: pos.y + 1, x: pos.x });
        }
      }
    });
    positions = newPositions;
  }

  return moves[to.y][to.x] || [];
}
