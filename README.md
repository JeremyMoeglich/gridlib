# TsGridLib

## Description

TsGridLib is a libary that simplifies using 2dArrays / Grids
with lots of utility functions with complete Typescript Support

## Install

```sh
npm install (or yarn / pnpm)
```

## Usage

```ts
import { Grid } from 'tsgridlib';

const grid = new Grid([
	[1, 2],
	[2, 3]
]);

grid.width(); // returns 2
grid.height(); // returns 2
grid.map((v) => v + 1); // returns new Grid([[2,3],[3,4]])
grid.get({ x: 1, y: 1 }); // returns 3
const grid_clone = grid.clone(); // returns new Grid([[1,2],[2,3]])
grid_clone.set({ x: 0, y: 1 }, 4); // mutates grid_clone to [[1,4],[2,3]]
grid.area(); // returns 4
grid.contains(5); // returns false
grid.contains(1); // returns true
grid.contains_position({ x: 0, y: 0 }); // returns true
grid.contains_position({ x: 4, y: 1 }); // returns false
grid.extend({ x: 3, y: 3 }, '10'); // returns new Grid([[1,2,10],[2,3,10],[10,10,10]])
grid.difference(
	new Grid([
		[3, 2],
		[7, 3]
	])
); // returns new Set([{x: 0, y: 0}, {x: 1, y: 1}])
grid.crop({ p1: { x: 1, y: 1 }, p2: { x: 1, y: 1 } }); // returns new Grid([[3]])
grid.all_positions(); // returns new Set([{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}])
```
