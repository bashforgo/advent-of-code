import { sumOf, zip } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { Grid } from "@utilities/grid/Grid.ts";
import { rotateClockwise } from "@utilities/grid/rotate.ts";
import { ObjectSet } from "@utilities/ObjectSet.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2
`
  : await getInput(2025, 12);

enum Tile {
  Empty = ".",
  Filled = "#",
}
type Shape = Grid<Tile>;
interface Present {
  id: number;
  shapeRotations: ObjectSet<Shape>;
  numberOfFilledTiles: number;
}

interface Region {
  width: number;
  height: number;
  presentRequirements: number[];
}

const { presents, regions } = (() => {
  const sections = input.trim().split("\n\n");
  const regionsString = sections.pop()!;
  const shapesStrings = sections;

  const presents = shapesStrings.map((shapeString): Present => {
    const [idLine, ...shapeLines] = shapeString.split("\n");
    const id = Number(idLine.slice(0, -1));
    const shape = shapeLines.map((line) => line.split("") as Tile[]);
    return {
      id,
      shapeRotations: ObjectSet.from((function* () {
        let currentShape: Shape = shape;
        yield currentShape;
        currentShape = rotateClockwise(currentShape);
        yield currentShape;
        currentShape = rotateClockwise(currentShape);
        yield currentShape;
        currentShape = rotateClockwise(currentShape);
        yield currentShape;
      })()),
      numberOfFilledTiles: shape
        .flat()
        .filter((tile) => tile === Tile.Filled)
        .length,
    };
  });

  const regions = regionsString.split("\n").map((regionLine): Region => {
    const [sizeString, presentsString] = regionLine.split(": ");
    const [widthString, heightString] = sizeString.split("x");
    const width = Number(widthString);
    const height = Number(heightString);
    const presentRequirements = presentsString.split(" ").map(Number);
    return { width, height, presentRequirements };
  });

  return { presents, regions };
})();

const part1 = () => {
  return regions
    .filter((region) => {
      const totalRequiredTiles = sumOf(
        zip(region.presentRequirements, presents),
        ([requirement, present]) => requirement * present.numberOfFilledTiles,
      );
      const area = region.width * region.height;
      return totalRequiredTiles <= area;
    })
    .length;
};
console.log(part1());
