// Implementation 1: Using for loop
// Time complexity: O(n)
// Space complexity: O(1)
var sum_to_n_a = function (n) {
  if (n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Implementation 2: Using mathematical formula
// Time complexity: O(1)
// Space complexity: O(1)
var sum_to_n_b = function (n) {
  if (n <= 0) return 0;
  return Math.floor((n * (n + 1)) / 2);
};

// Implementation 3: Using recursion
// Time complexity: O(n)
// Space complexity: O(n)
var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  function sum(num, acc) {
    if (num <= 0) return acc;
    return sum(num - 1, acc + num);
  }
  return sum(n, 0);
};
