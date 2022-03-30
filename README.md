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
import { Grid } from 'tsgridlib'

const grid = new Grid([[1,2],[2,3]])

console.log('width: ', grid.width())
console.log('height: ', grid.height())

console.log('map +1: ', grid.map((v) => (v+1)))
```
