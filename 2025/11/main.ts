import { dijkstras, getNumberOfPaths, getPath } from "@utilities/dijkstras.ts";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? [
    `\
aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out
`,
    `\
svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`,
  ][1]
  : await getInput(2025, 11);

const OUT = "out";

const lines = input.trim().split("\n");

const graph = new Map(
  lines.map((line) => {
    const [from, connectionsString] = line.split(": ");
    const connections = connectionsString.split(" ");
    return [from, new Set(connections)];
  }),
);

const part1 = () => {
  const YOU = "you";

  const result = dijkstras(
    YOU,
    (node) => graph.get(node) ?? new Set(),
    () => 0,
  );
  return getNumberOfPaths(OUT, result.previous);
};
console.log(part1());

const part2 = () => {
  const SVR = "svr";
  const DAC = "dac";
  const FFT = "fft";

  const fromSvr = dijkstras(
    SVR,
    (node) => graph.get(node) ?? new Set(),
    () => 0,
  );
  const fromDac = dijkstras(
    DAC,
    (node) => graph.get(node) ?? new Set(),
    () => 0,
  );
  const fromFft = dijkstras(
    FFT,
    (node) => graph.get(node) ?? new Set(),
    () => 0,
  );

  const isThereAPathFromFftToDac = getPath(DAC, fromFft.previous).length > 0;

  return isThereAPathFromFftToDac
    ? getNumberOfPaths(FFT, fromSvr.previous) *
      getNumberOfPaths(DAC, fromFft.previous) *
      getNumberOfPaths(OUT, fromDac.previous)
    : getNumberOfPaths(DAC, fromSvr.previous) *
      getNumberOfPaths(FFT, fromDac.previous) *
      getNumberOfPaths(OUT, fromFft.previous);
};
console.log(part2());
