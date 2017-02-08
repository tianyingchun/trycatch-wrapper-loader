export const sqrt = Math.sqrt;

export function square(x) {
  try {
    return x * x;
  } catch (e) {

  }
}

export function diag(x, y) {
  return sqrt(square(x) + square(y));
}
