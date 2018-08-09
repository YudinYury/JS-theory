interface Named {
    name: string;
}
 
let x: Named;
let z = { name: "Alice"};
console.log('z =', z);
// выведенный для y тип — { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };
x = y;
console.log('x =', x);
z = y;
console.log('z =', z);
