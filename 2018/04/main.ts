import { unreachable } from "@std/assert";
import { maxBy, sumOf } from "@std/collections";
import { getInput } from "@utilities/getInput.ts";
import { identity } from "@utilities/identity.ts";
import { ObjectMap } from "@utilities/ObjectMap.ts";

const DEBUG = false;
const input = DEBUG
  ? `\
[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
`
  : await getInput(2018, 4);

const MIDNIGHT_HOUR = {
  START: Temporal.PlainTime.from("00:00:00"),
  END: Temporal.PlainTime.from("00:59:59"),
};

function* MIDNIGHT_HOUR_MINUTES() {
  let current = MIDNIGHT_HOUR.START;
  while (Temporal.PlainTime.compare(current, MIDNIGHT_HOUR.END) <= 0) {
    yield current;
    current = current.add({ minutes: 1 });
  }
}

enum RecordType {
  BeginShift = "BeginShift",
  FallAsleep = "FallAsleep",
  WakeUp = "WakeUp",
}

interface BaseRecord {
  type: RecordType;
  timestamp: Temporal.PlainDateTime;
}

interface BeginShiftRecord extends BaseRecord {
  type: RecordType.BeginShift;
  guardId: number;
}

interface FallAsleepRecord extends BaseRecord {
  type: RecordType.FallAsleep;
}

interface WakeUpRecord extends BaseRecord {
  type: RecordType.WakeUp;
}

type Record =
  | BeginShiftRecord
  | FallAsleepRecord
  | WakeUpRecord;

const records = input.trim()
  .split("\n")
  .map((line): Record => {
    const match = line.match(
      /^\[(?<timestamp>.+?)\] Guard #(?<guardId>\d+) (?<type>begins shift)/,
    ) ??
      line.match(/^\[(?<timestamp>.+?)\] (?<type>falls asleep|wakes up)/) ??
      unreachable();
    const timestamp = Temporal.PlainDateTime.from(match.groups!.timestamp);
    switch (match.groups!.type) {
      case "begins shift":
        return {
          type: RecordType.BeginShift,
          timestamp,
          guardId: Number(match.groups!.guardId),
        } as BeginShiftRecord;
      case "falls asleep":
        return {
          type: RecordType.FallAsleep,
          timestamp,
        } as FallAsleepRecord;
      case "wakes up":
        return {
          type: RecordType.WakeUp,
          timestamp,
        } as WakeUpRecord;
      default:
        return unreachable();
    }
  })
  .sort((a, b) => Temporal.PlainDateTime.compare(a.timestamp, b.timestamp));

const recordsByDate = ObjectMap.groupBy(
  records,
  (r) => r.timestamp.toPlainDate(),
);

const beginShiftRecords = records.filter((r) =>
  r.type === RecordType.BeginShift
);

const guardIdByDate = ObjectMap.from(
  recordsByDate.keys()
    .flatMap((date) => {
      const shiftEndDateTime = date.toPlainDateTime(MIDNIGHT_HOUR.END);
      const record = beginShiftRecords.findLast((r) =>
        Temporal.PlainDateTime.compare(r.timestamp, shiftEndDateTime) <= 0
      );
      return record == null ? [] : [[date, record.guardId]];
    }),
);

function* minutelyRecords(date: Temporal.PlainDate) {
  const records = recordsByDate.get(date)!;

  for (const minute of MIDNIGHT_HOUR_MINUTES()) {
    const record = records.findLast((r) =>
      Temporal.PlainTime.compare(r.timestamp.toPlainTime(), minute) <= 0
    );
    const isAsleep = record?.type === RecordType.FallAsleep;
    yield { minute, isAsleep };
  }
}

const allMinutelyRecords = ObjectMap.from(
  guardIdByDate.keys()
    .map((date) => [date, [...minutelyRecords(date)]]),
);

const minutelyRecordsByGuardId = ObjectMap.groupBy(
  allMinutelyRecords.entries(),
  ([date]) => guardIdByDate.get(date)!,
);

const sleepingHistogramByGuardId = ObjectMap.from(
  minutelyRecordsByGuardId.entries()
    .map(([guardId, records]) => {
      const sleepingHistogram = ObjectMap.countBy(
        records.flatMap(([, records]) => records)
          .filter((r) => r.isAsleep),
        (r) => r.minute,
      );
      return [guardId, sleepingHistogram] as const;
    }),
);

const part1 = () => {
  const asleepMinutesByGuardId = sleepingHistogramByGuardId.map(
    (histogram) => sumOf(histogram.values(), identity),
  );
  const [mostSleepyGuardId] = maxBy(
    asleepMinutesByGuardId.entries(),
    ([, minutes]) => minutes,
  )!;
  const sleepingHistogram = sleepingHistogramByGuardId.get(mostSleepyGuardId)!;
  const [mostFrequentSleepingMinute] = maxBy(
    sleepingHistogram.entries(),
    ([, count]) => count,
  )!;
  return mostSleepyGuardId * mostFrequentSleepingMinute.minute;
};
console.log(part1());

const part2 = () => {
  const mostFrequentSleepingMinuteByGuardId = sleepingHistogramByGuardId.map(
    (histogram) =>
      maxBy(
        histogram.entries(),
        ([, count]) => count,
      ) ?? [MIDNIGHT_HOUR.START, -1] as const,
  );
  const [mostFrequentSleepingGuardId, [mostFrequentSleepingMinute]] = maxBy(
    mostFrequentSleepingMinuteByGuardId.entries(),
    ([, [, count]]) => count,
  )!;
  return mostFrequentSleepingGuardId * mostFrequentSleepingMinute.minute;
};
console.log(part2());
