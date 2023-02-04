export function findReachablePlates(
  mapProp: mapInfo,
  startPosition: cellCordinates
) {
  // if cell's free to move: true; else : false
  let map = mapProp.map((row, y0) =>
    row.map((cell, x0) => ({
      visited: y0 === startPosition.y && x0 === startPosition.x,
      empty: cell !== "wall",
    }))
  );
  // all reachable positions; checked means was this position detected in the loop
  let reachable = [{ ...startPosition, checked: false }];

  // main checking loop
  let haveUnchecked = true;
  while (haveUnchecked) {
    haveUnchecked = false;
    reachable.forEach((pos) => {
      // don't do anuthing if cell've already been checked
      if (pos.checked) return;
      // else, turned out at least one unchecked cell
      haveUnchecked = true;
      // make this pos checked
      pos.checked = true;
      // check all the directions

      // up
      if (
        pos.y > 0 &&
        map[pos.y - 1][pos.x].empty &&
        !map[pos.y - 1][pos.x].visited
      ) {
        map[pos.y - 1][pos.x].visited = true;
        reachable.push({ y: pos.y - 1, x: pos.x, checked: false });
      }

      // down
      if (
        pos.y < map.length - 1 &&
        map[pos.y + 1][pos.x].empty &&
        !map[pos.y + 1][pos.x].visited
      ) {
        map[pos.y + 1][pos.x].visited = true;
        reachable.push({ y: pos.y + 1, x: pos.x, checked: false });
      }

      // left
      if (
        pos.x > 0 &&
        map[pos.y][pos.x - 1].empty &&
        !map[pos.y][pos.x - 1].visited
      ) {
        map[pos.y][pos.x - 1].visited = true;
        reachable.push({ y: pos.y, x: pos.x - 1, checked: false });
      }

      // right
      if (
        pos.x < map[pos.y].length - 1 &&
        map[pos.y][pos.x + 1].empty &&
        !map[pos.y][pos.x + 1].visited
      ) {
        map[pos.y][pos.x + 1].visited = true;
        reachable.push({ y: pos.y, x: pos.x + 1, checked: false });
      }
    });
    // If all the cells've already been checked, quit from loop
  }

  type visualReachableType = ("-" | "o" | "+")[][];
  let visualReachable: visualReachableType = [...Array(map.length)].map(() =>
    [...Array(map[0].length)].fill("-")
  );
  reachable.forEach((pos) => {
    visualReachable[pos.y][pos.x] = "+";
  });
  // ^ DEBUG:
  visualReachable[startPosition.y][startPosition.x] = "o";
  // console.log(visualReachable.map((row) => row.join(" ")).join("\n"));

  return visualReachable;
  // return reachable posiitons
  // return reachable;
}

export function isReachable(
  map: mapInfo,
  from: cellCordinates,
  to: cellCordinates
) {
  let reachable = findReachablePlates(map, from);
  return reachable[to.y][to.x] !== "-";
}
