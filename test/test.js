const xstate = require('xstate');
const activities = require('../src');
const definition = {
  initial: "A",
  states: {
    A: {
      activities: "foo",
      on: { "e": "B" }
    },
    B: {
      activities: [ "foo", "bar" ]
    }
  }
};

const machine = new xstate.Machine(activities.preprocess(definition));

let state = machine.initialState;

var { toStop, toStart, actions } = activities.filterActions(state.actions);

console.log('stop', toStop);
console.log('start', toStart);
console.log('actions', actions);

state = machine.transition(state, 'e');
var { toStop, toStart, actions } = activities.filterActions(state.actions);

console.log('stop', toStop);
console.log('start', toStart);
console.log('actions', actions);

