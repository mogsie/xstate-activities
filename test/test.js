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

console.log(state.actions);
// [ 'xstate.activity.start (foo)' ]

state = machine.transition(state, 'e');

console.log(state.actions);
//  [ 'xstate.activity.stop (foo)',           
//   'xstate.activity.start (foo)',          
//   'xstate.activity.start (bar)' ] 



