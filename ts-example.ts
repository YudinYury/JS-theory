
interface Named {
    name: string;
}
 
let x: Named;
// выведенный для y тип — { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };
x = y;

