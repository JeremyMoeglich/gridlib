import { Grid } from '$lib';
import { assert, it } from 'vitest';

it('1', () => {
	const grid = new Grid({ x: 7, y: 11 });
	assert.equal(grid.contains_position({ x: 0, y: 0 }), true);
	assert.equal(grid.contains_position({ x: 6, y: 10 }), true);
	assert.equal(grid.contains_position({ x: 7, y: 10 }), false);
	assert.equal(grid.contains_position({ x: 6, y: 11 }), false);
	assert.equal(grid.contains_position({ x: -1, y: 0 }), false);
	assert.equal(grid.contains_position({ x: 0, y: -1 }), false);
	assert.equal(grid.width(), 7);
	assert.equal(grid.height(), 11);
	assert.equal(grid.area(), 77);
	assert.equal(grid.get({ x: 3, y: 2 }), undefined);
	assert.equal(grid.contains('a'), false);
	grid.set({ x: 3, y: 2 }, 'a');
	assert.equal(grid.contains('a'), true);
	assert.equal(grid.contains(undefined), true);
	assert.equal(grid.get({ x: 3, y: 2 }), 'a');
	const grid2 = grid.crop({ p1: { x: 3, y: 2 }, p2: { x: 5, y: 5 } });
	assert.equal(grid2.width(), 3);
	assert.equal(grid2.height(), 4);
	assert.equal(grid2.area(), 12);
	assert.equal(grid2.get({ x: 0, y: 0 }), 'a');
	const grid3 = grid2.extend({ x: 5, y: 6 }, 'c');
	assert.equal(grid3.get({ x: 4, y: 4 }), 'c');
	assert.equal(grid3.width(), 5);
	assert.equal(grid3.height(), 6);
	assert.equal(grid3.area(), 5 * 6);
	const ap = [...grid3.all_positions()];
	assert.equal(ap.length, 5 * 6);
	assert.equal(ap.map((v) => JSON.stringify(v)).includes(JSON.stringify({ x: 2, y: 1 })), true);
	const grid4 = grid3.clone();
	grid4.set({ x: 3, y: 2 }, 'ok');
	assert.deepEqual(grid4.difference(grid3), new Set([{ x: 3, y: 2 }]));
});

it('readme', () => {
	const grid = new Grid([
		[1, 2],
		[2, 3]
	]);

	assert.equal(grid.width(), 2);
	assert.equal(grid.height(), 2);
	assert.deepEqual(
		grid.map((v) => v + 1),
		new Grid([
			[2, 3],
			[3, 4]
		])
	);
	const grid_clone = grid.clone();
	assert.deepEqual(grid_clone, grid);
	grid_clone.set({ x: 0, y: 1 }, 4);
	assert.equal(grid_clone.get({ x: 0, y: 1 }), 4);
	assert.deepEqual(
		grid_clone,
		new Grid([
			[1, 4],
			[2, 3]
		])
	);
	assert.equal(grid.contains(5), false);
	assert.equal(grid.contains(1), true);
	assert.equal(grid.contains_position({ x: 0, y: 0 }), true);
	assert.equal(grid.contains_position({ x: 4, y: 1 }), false);
	assert.deepEqual(
		grid.extend({ x: 3, y: 3 }, 10),
		new Grid([
			[1, 2, 10],
			[2, 3, 10],
			[10, 10, 10]
		])
	);
	assert.deepEqual(
		grid.difference(
			new Grid([
				[3, 2],
				[7, 3]
			])
		),
		new Set([
			{ x: 0, y: 0 },
			{ x: 1, y: 0 }
		])
	);
	assert.equal(grid.area(), 4);
	assert.equal(grid.get({ x: 1, y: 1 }), 3);
	assert.deepEqual(grid.crop({ p1: { x: 1, y: 1 }, p2: { x: 1, y: 1 } }), new Grid([[3]]));
	assert.deepEqual(
		grid.all_positions(),
		new Set([
			{ x: 0, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 0 },
			{ x: 1, y: 1 }
		])
	);
});
