import { Grid } from '$lib';
import { assert, it } from 'vitest';

it('1', () => {
	const grid = new Grid({ x: 6, y: 10 });
	assert.equal(grid.contains_position({ x: 0, y: 0 }), true);
	assert.equal(grid.contains_position({ x: 6, y: 10 }), true);
	assert.equal(grid.contains_position({ x: 7, y: 10 }), false);
	assert.equal(grid.contains_position({ x: 6, y: 11 }), false);
	assert.equal(grid.contains_position({ x: -1, y: 0 }), false);
	assert.equal(grid.contains_position({ x: 0, y: -1 }), false);
	assert.equal(grid.width(), 6);
	assert.equal(grid.height(), 10);
	assert.equal(grid.area(), 60);
	assert.equal(grid.get({ x: 3, y: 2 }), undefined);
	grid.set({ x: 3, y: 2 }, 'a');
	assert.equal(grid.get({ x: 3, y: 2 }), 'a');
	const grid2 = grid.crop({ p1: { x: 3, y: 2 }, p2: { x: 5, y: 5 } });
	assert.equal(grid2.width(), 3);
	assert.equal(grid2.height(), 4);
	assert.equal(grid2.area(), 12);
	assert.equal(grid2.get({ x: 0, y: 0 }), 'a');
	grid2.extend({ x: 5, y: 6 }, 'c');
	assert.equal(grid2.get({ x: 4, y: 4 }), 'c');
	assert.equal(grid2.width(), 5);
	assert.equal(grid2.height(), 6);
});
