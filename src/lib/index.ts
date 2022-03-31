import { hasProperty, range, zip } from 'functional-utilities';
import center from 'center-align';

export interface vector {
	x: number;
	y: number;
}

export interface area {
	p1: vector;
	p2: vector;
}

function is_vector(v: unknown): v is vector {
	return hasProperty(v, 'x') && hasProperty(v, 'y');
}

const offsets = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0]
];

export class Grid<T> {
	public content: T[][];
	constructor(content: T[][] | vector | undefined = undefined) {
		if (content === undefined) {
			this.content = [];
		} else if (is_vector(content)) {
			this.content = [];
			for (let i = 0; i < content.x; i++) {
				this.content[i] = [];
				for (let j = 0; j < content.y; j++) {
					this.content[i][j] = undefined;
				}
			}
		} else {
			this.content = content;
		}
	}
	neighbour_offsets(
		position: vector,
		filter: (value: T, position: vector) => boolean
	): Set<vector> {
		if (!this.contains_position(position)) {
			return undefined;
		}

		return new Set(
			offsets
				.filter((offset) => {
					return (
						this.content[position.x + offset[0]] &&
						this.content[position.x + offset[0]][position.y + offset[1]] &&
						filter(this.content[position.x + offset[0]][position.y + offset[1]], {
							x: position.x + offset[0],
							y: position.y + offset[1]
						})
					);
				})
				.map((offset) => {
					return { x: offset[0], y: offset[1] };
				})
		);
	}

	neighbours(position: vector, filter: (value: T, position: vector) => boolean): Set<vector> {
		if (!this.contains_position(position)) {
			return undefined;
		}

		return new Set(
			[...this.neighbour_offsets(position, filter)].map((offset) => ({
				x: position.x + offset.x,
				y: position.y + offset.y
			}))
		);
	}
	crop(area: area): Grid<T> {
		const minX = Math.max(area.p1.x, 0);
		const minY = Math.max(area.p1.y, 0);
		const maxX = Math.min(area.p2.x, this.width());
		const maxY = Math.min(area.p2.y, this.height());
		return new Grid<T>(
			this.content.slice(minX, maxX + 1).map((row) => {
				return row.slice(minY, maxY + 1);
			})
		);
	}
	get(position: vector): T {
		if (this.contains_position(position)) {
			return this.content[position.x][position.y];
		} else {
			return undefined;
		}
	}
	set(position: vector, value: T): void {
		if (this.contains_position(position)) {
			this.content[position.x][position.y] = value;
		} else {
			throw new Error('Position out of bounds');
		}
	}
	map<NT>(callback: (value: T, position: vector) => NT): Grid<NT> {
		return new Grid<NT>(
			this.content.map((row, x) => {
				return row.map((value, y) => {
					return callback(value, { x: x, y: y++ });
				});
			})
		);
	}
	width(): number {
		return this.content.length;
	}
	height(): number {
		if (this.content.length > 0) {
			return this.content[0].length;
		} else {
			return 0;
		}
	}
	dimensions(): vector {
		return {
			x: this.width(),
			y: this.height()
		};
	}
	area(): number {
		return this.width() * this.height();
	}
	forEach(callback: (value: T, position: vector) => unknown): void {
		this.content.forEach((row, x) => {
			row.forEach((value, y) => {
				callback(value, { x, y });
			});
		});
	}
	toString(): string {
		function to_grid_string(value: unknown): string | undefined {
			if (hasProperty(value, 'toString')) {
				if (typeof value.toString === 'function') {
					const string = value.toString();
					if (typeof string === 'string') {
						return string;
					} else {
						return undefined;
					}
				} else {
					return undefined;
				}
			} else {
				return undefined;
			}
		}
		const grid_string_grid = this.map((value) => to_grid_string(value)).rotate();
		if (grid_string_grid.contains(undefined)) {
			return grid_string_grid.content.map((v) => `[${v.toString()}]`).join(', ');
		} else {
			const max_column_length = grid_string_grid.columns().map((strings) => {
				return Math.max(...strings.map((string) => string.length));
			}, 0);
			return (
				(this.height() > 1 ? '\n' : '') +
				grid_string_grid
					.rows()
					.map((strings) => {
						return strings
							.map((string, column_index) => {
								return center(string, max_column_length[column_index]);
							})
							.join(', ');
					})
					.join('\n')
			);
		}
	}
	rows(): T[][] {
		return this.content;
	}
	columns(): T[][] {
		return zip(this.content);
	}
	rotate(): Grid<T> {
		return new Grid<T>(zip(this.content));
	}
	contains(value: T): boolean {
		return this.content.some((row) => {
			return row.some((v) => {
				return v === value;
			});
		});
	}
	find(value: T): vector | undefined {
		for (let x = 0; x < this.content.length; x++) {
			for (let y = 0; y < this.content[x].length; y++) {
				if (this.content[x][y] === value) {
					return { x, y };
				}
			}
		}
		return undefined;
	}
	extend(new_size: vector, value: T): Grid<T> {
		if (new_size.x < this.width() || new_size.y < this.height()) {
			throw new Error('Cannot extend grid to smaller size');
		}
		return new Grid<T>(
			this.content
				.map((row) => {
					return row.concat(new Array(new_size.x - this.width()).fill(value));
				})
				.concat(new Array(new_size.x - this.width()).fill(new Array(new_size.y).fill(value)))
		);
	}
	flip_x(): Grid<T> {
		return new Grid<T>(
			this.content.map((row) => {
				return row.reverse();
			})
		);
	}
	flip_y(): Grid<T> {
		return new Grid<T>(this.content.reverse());
	}
	fill_undefined(value: T): Grid<T> {
		return new Grid<T>(
			this.content.map((row) => {
				return row.map((v) => {
					return v === undefined ? value : v;
				});
			})
		);
	}
	fill_all(value: T): Grid<T> {
		return new Grid<T>(
			this.content.map((row) => {
				return row.map(() => {
					return value;
				});
			})
		);
	}
	overlay(position: vector, grid: Grid<T>): Grid<T> {
		return new Grid<T>(
			this.content.map((row, x) => {
				return row.map((value, y) => {
					return value === undefined ? grid.get({ x: x + position.x, y: y + position.y }) : value;
				});
			})
		);
	}
	map_area(area: area, callback: (value: T, position: vector) => T): Grid<T> {
		return this.overlay({ x: area.p1.x, y: area.p1.y }, this.crop(area).map(callback));
	}
	fill_area(area: area, value: T): Grid<T> {
		return this.map_area(area, () => value);
	}
	pathfind(start: vector, end: vector, allowed: (value: T, position: vector) => boolean): vector[] {
		const path: vector[] = [];
		const visited: Set<vector> = new Set();
		const frontier: Set<vector> = new Set([start]);
		while (frontier.size > 0) {
			const current = Array.from(frontier)[0];
			frontier.delete(current);
			if (current === end) {
				break;
			}
			visited.add(current);
			for (const neighbour of this.neighbours(current, allowed)) {
				if (visited.has(neighbour)) {
					continue;
				}
				if (frontier.has(neighbour)) {
					continue;
				}
				frontier.add(neighbour);
				path.push(neighbour);
			}
		}
		if (visited.has(end)) {
			return path;
		} else {
			return undefined;
		}
	}
	contains_position(position: vector): boolean {
		return (
			position.x >= 0 && position.y >= 0 && position.x < this.width() && position.y < this.height()
		);
	}
	clone(): Grid<T> {
		return new Grid<T>(this.content.map((row) => row.slice()));
	}

	difference(other: Grid<T>): Set<vector> {
		const diff: Array<vector> = [];
		this.forEach((value, position) => {
			if (other.get(position) !== value) {
				diff.push(position);
			}
		});
		return new Set(diff);
	}
	all_positions(): Set<vector> {
		return new Set(
			range(this.width())
				.map((x) => range(this.height()).map((y) => ({ x: x, y: y })))
				.reduce((a, b) => a.concat(b))
		);
	}
	pad_cells(filter: (value: T, position: vector) => boolean): Grid<boolean> {
		const padded = this.map((_, position) => [...this.neighbours(position, filter)].length > 0);
		return this.map((value, position) => filter(value, position) || padded.get(position));
	}
}
