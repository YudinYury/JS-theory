
function maxArgs() {
    let args = [].slice.call(arguments);
    return Math.max.apply(null, args);
};

function sumArgs() {
    let args = [].slice.call(arguments);
    return args.reduce( (summ, curr) => {
        summ+=curr;
        return summ; 
    }, 0);
};


console.log(maxArgs(1, 3, 7)); // 7, аргументы переданы через запятую, без массива
console.log(sumArgs(1, 3, 7)); // 11, аргументы переданы через запятую, без массива


const context = { foo: "bar" };
function returnFoo (param) {
    if(param) {
        return this.foo + '-' + param;
    } else {
        return this.foo;
    }
}

// const bind = Function.prototype.call.bind(Function.prototype.bind);
// const amazing = bind(returnFoo, context);

const amazing = returnFoo.bind(context);
console.log(amazing('bind'));  // => bar

console.log(returnFoo.call(context, 'call'));  // => bar
console.log(returnFoo.apply(context, ['apply']));  // => bar


/*
const barker = (state) => ({
    bark: () => console.log('Woof, I am ' + state.name)
    });
const driver = (state) => ({
    drive: () => state.position = state.position + state.speed
    });
const killer = (state) => ({
    kill: () => console.log('I am ' + state.name + '. I kill you')
    });
      
const murderRobotDog = (name)  => {
    let state = {
      name,
      speed: 100,
      position: 0
    }
    return Object.assign(
          {},
          barker(state),
          driver(state),
          killer(state)
      )
  }
const bruno =  murderRobotDog('bruno')
bruno.bark(); // "Woof, I am Bruno"
bruno.kill();
*/
