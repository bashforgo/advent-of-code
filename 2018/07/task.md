<style>[title] { text-decoration: underline dotted; }</style>

\--- Day 7: The Sum of Its Parts ---
------------------------------------

You find yourself standing on a snow-covered coastline; apparently, you landed a little off course. The region is too hilly to see the North Pole from here, but you do spot some Elves that seem to be trying to unpack something that washed ashore. It's quite cold out, so you decide to risk creating a paradox by asking them for directions.

"Oh, are you the search party?" Somehow, you can understand whatever Elves from the year 1018 speak; you assume it's [Ancient Nordic Elvish](/2015/day/6). Could the device on your wrist also be a translator? "Those clothes don't look very warm; take this." They hand you a heavy coat.

"We do need to find our way back to the North Pole, but we have higher priorities at the moment. You see, believe it or not, this box contains something that will solve all of Santa's transportation problems - at least, that's what it looks like from the pictures in the instructions." It doesn't seem like they can read whatever language it's in, but you can: "Sleigh kit. <span title="Just some oak and some pine and a handful of Norsemen.">Some assembly required.</span>"

"'Sleigh'? What a wonderful name! You must help us assemble this 'sleigh' at once!" They start excitedly pulling more parts out of the box.

The instructions specify a series of _steps_ and requirements about which steps must be finished before others can begin (your puzzle input). Each step is designated by a single letter. For example, suppose you have the following instructions:

```
Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
```

Visually, these requirements look like this:

```
  -->A--->B--
 /    \      \
C      -->D----->E
 \           /
  ---->F-----
```

Your first goal is to determine the order in which the steps should be completed. If more than one step is ready, choose the step which is first alphabetically. In this example, the steps would be completed as follows:

*   Only _`C`_ is available, and so it is done first.
*   Next, both `A` and `F` are available. _`A`_ is first alphabetically, so it is done next.
*   Then, even though `F` was available earlier, steps `B` and `D` are now also available, and _`B`_ is the first alphabetically of the three.
*   After that, only `D` and `F` are available. `E` is not available because only some of its prerequisites are complete. Therefore, _`D`_ is completed next.
*   _`F`_ is the only choice, so it is done next.
*   Finally, _`E`_ is completed.

So, in this example, the correct order is _`CABDFE`_.

_In what order should the steps in your instructions be completed?_

\--- Part Two ---
-----------------

As you're about to begin construction, four of the Elves offer to help. "The sun will set soon; it'll go faster if we work together." Now, you need to account for multiple people working on steps simultaneously. If multiple steps are available, workers should still begin them in alphabetical order.

Each step takes 60 seconds plus an amount corresponding to its letter: A=1, B=2, C=3, and so on. So, step A takes `60+1=61` seconds, while step Z takes `60+26=86` seconds. No time is required between steps.

To simplify things for the example, however, suppose you only have help from one Elf (a total of two workers) and that each step takes 60 fewer seconds (so that step A takes 1 second and step Z takes 26 seconds). Then, using the same instructions as above, this is how each second would be spent:

```
Second   Worker 1   Worker 2   Done
   0        C          .        
   1        C          .        
   2        C          .        
   3        A          F       C
   4        B          F       CA
   5        B          F       CA
   6        D          F       CAB
   7        D          F       CAB
   8        D          F       CAB
   9        D          .       CABF
  10        E          .       CABFD
  11        E          .       CABFD
  12        E          .       CABFD
  13        E          .       CABFD
  14        E          .       CABFD
  15        .          .       CABFDE
```

Each row represents one second of time. The Second column identifies how many seconds have passed as of the beginning of that second. Each worker column shows the step that worker is currently doing (or `.` if they are idle). The Done column shows completed steps.

Note that the order of the steps has changed; this is because steps now take time to finish and multiple workers can begin multiple steps simultaneously.

In this example, it would take _15_ seconds for two workers to complete these steps.

With _5_ workers and the _60+ second_ step durations described above, _how long will it take to complete all of the steps?_