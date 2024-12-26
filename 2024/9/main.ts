import { sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
2333133121414131402
`
  : await getInput(2024, 9);

const rawDisk = input.trim().split("").map(Number);

enum BlockType {
  File = "File",
  Empty = "Empty",
}
type Block =
  | { type: BlockType.File; id: number }
  | { type: BlockType.Empty };

const inputDisk: Block[] = [];
let id = 0;
let type = BlockType.File as BlockType;
for (const value of rawDisk) {
  const block = ((): Block => {
    switch (type) {
      case BlockType.File:
        return { type: BlockType.File, id };
      case BlockType.Empty:
        return { type: BlockType.Empty };
    }
  })();
  for (let i = 0; i < value; i++) {
    inputDisk.push(block);
  }

  switch (type) {
    case BlockType.File:
      type = BlockType.Empty;
      id++;
      break;
    case BlockType.Empty:
      type = BlockType.File;
      break;
  }
}

const compactFragments = () => {
  const disk = structuredClone(inputDisk);
  let headIndex = 0;
  let tailIndex = disk.length - 1;
  while (headIndex < tailIndex) {
    const head = disk[headIndex];
    if (head.type === BlockType.File) {
      headIndex++;
      continue;
    }

    const tail = disk[tailIndex];
    if (tail.type === BlockType.Empty) {
      tailIndex--;
      continue;
    }

    [
      disk[headIndex],
      disk[tailIndex],
    ] = [
      disk[tailIndex],
      disk[headIndex],
    ];
  }

  return disk;
};

console.log(
  sumOf(
    compactFragments().entries(),
    ([index, block]) => block.type === BlockType.File ? index * block.id : 0,
  ),
);

const compactFiles = () => {
  const disk = structuredClone(inputDisk);

  for (let i = disk.length - 1; i >= 0; i--) {
    const block = disk[i];
    if (block.type === BlockType.Empty) continue;

    let fileLength = 1;
    for (let j = i - 1; j >= 0; j--) {
      const prevBlock = disk[j];
      if (prevBlock.type === BlockType.Empty) break;
      if (prevBlock.id !== block.id) break;
      fileLength++;
    }

    let leftmostEmptySpaceStartIndexThatFitsFile = -1;
    for (let j = 0; j < i; j++) {
      const maybeEmptyBlock = disk[j];
      if (maybeEmptyBlock.type === BlockType.File) continue;

      let emptySpaceLength = 1;
      for (let k = j + 1; k < i; k++) {
        const nextBlock = disk[k];
        if (nextBlock.type === BlockType.File) break;
        emptySpaceLength++;
      }

      if (emptySpaceLength < fileLength) continue;

      leftmostEmptySpaceStartIndexThatFitsFile = j;
      break;
    }

    if (leftmostEmptySpaceStartIndexThatFitsFile === -1) {
      i -= fileLength - 1;
      continue;
    }

    const fileBlocks = disk.splice(i - fileLength + 1, fileLength);
    const emptyBlocks = disk.splice(
      leftmostEmptySpaceStartIndexThatFitsFile,
      fileLength,
      ...fileBlocks,
    );
    disk.splice(i - fileLength + 1, 0, ...emptyBlocks);
  }

  return disk;
};

console.log(
  sumOf(
    compactFiles().entries(),
    ([index, block]) => block.type === BlockType.File ? index * block.id : 0,
  ),
);
