import '../css/index.css';
import { mul } from './test';

function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4, 5));

// eslint-disable-next-line
console.log(mul(2, 2));