import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
qzmt-zixmtkozy-ivhz-343[zimth]
aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]
`
  : await getInput(2016, 4);

const lines = input.trim().split("\n");

interface Room {
  name: string;
  sectorId: number;
  checksum: string;
}

const rooms = lines.map((line): Room => {
  const [, name, sectorId, checksum] = line.match(
    /([a-z-]+)-(\d+)\[([a-z]+)\]/,
  )!;
  return { name, sectorId: Number(sectorId), checksum };
});

const computeChecksum = (name: string) => {
  const letters = name.replace(/-/g, "");
  const counts = new Map(
    Map.groupBy(letters, identity)
      .entries()
      .map(([letter, group]) => [letter, group.length]),
  );
  const sortedCounts = counts.entries()
    .toArray()
    .toSorted(([aLetter, aCount], [bLetter, bCount]) => {
      return aCount === bCount
        ? aLetter.localeCompare(bLetter)
        : bCount - aCount;
    });
  return sortedCounts.slice(0, 5).map(([letter]) => letter).join("");
};

const part1 = () => {
  return sumOf(
    rooms.filter(({ name, checksum }) => checksum === computeChecksum(name)),
    ({ sectorId }) => sectorId,
  );
};
console.log(part1());

const shiftLetter = (letter: string, shift: number) => {
  const CHAR_CODE_A = "a".charCodeAt(0);

  const code = letter.charCodeAt(0);
  const index = code - CHAR_CODE_A;
  const shiftedIndex = (index + shift) % 26;
  return String.fromCharCode(CHAR_CODE_A + shiftedIndex);
};

const decrypt = (name: string, sectorId: number) => {
  return name.split("-")
    .map((word) =>
      word.split("").map((letter) => shiftLetter(letter, sectorId)).join("")
    )
    .join(" ");
};

const part2 = () => {
  return rooms
    .filter(({ name, checksum }) => checksum === computeChecksum(name))
    .map(({ name, sectorId }) => [decrypt(name, sectorId), sectorId] as const)
    .find(([decrypted]) => decrypted.includes("north"))![1];
};
console.log(part2());
