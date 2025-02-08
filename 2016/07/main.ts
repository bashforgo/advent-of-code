import { partition, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn
aba[bab]xyz
xyx[xyx]xyx
aaa[kek]eke
zazbz[bzb]cdb
`
  : await getInput(2016, 7);

const ips = input.trim().split("\n");

const hasAbba = (s: string) => {
  const abbaRegExp = /(.)(?!\1)(.)\2\1/g;
  return abbaRegExp.test(s);
};

const parseIp = (ip: string) => {
  const partsRegExp = /\[([^\]]+)\]|([^\[\]]+)/g;
  return ip.matchAll(partsRegExp)
    .map(([, hypernet, supernet]): [isHypernet: boolean, part: string] =>
      hypernet == null ? [false, supernet] : [true, hypernet]
    );
};

const part1 = () => {
  return sumOf(ips, (ip) => {
    const [hypernetParts, supernetParts] = partition(
      parseIp(ip),
      ([isHypernet]) => isHypernet,
    ).map((parts) => parts.map(([, part]) => part));
    const hasTls = supernetParts.some(hasAbba) && !hypernetParts.some(hasAbba);
    return hasTls ? 1 : 0;
  });
};
console.log(part1());

const getAbas = (s: string) => {
  const abaRegExp = /(.)(?=(?!\1)(.)\1)/g;
  return new Set(s.matchAll(abaRegExp).map(([, a, b]) => `${a}${b}${a}`));
};

const abaToBab = (aba: string) => {
  const [a, b] = aba;
  return `${b}${a}${b}`;
};

const part2 = () => {
  return sumOf(ips, (ip) => {
    const [hypernetParts, supernetParts] = partition(
      parseIp(ip),
      ([isHypernet]) => isHypernet,
    ).map((parts) => parts.map(([, part]) => part));

    const abas = supernetParts.reduce(
      (abas, part) => abas.union(getAbas(part)),
      new Set<string>(),
    );

    const hasSsl = abas.values().some((aba) =>
      hypernetParts.some((part) => part.includes(abaToBab(aba)))
    );
    return hasSsl ? 1 : 0;
  });
};
console.log(part2());
