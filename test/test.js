const EventEmitter = require('events');
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

const start = new EventEmitter();
start.on('foo', () => console.log("starting foo"));
start.on('bar', () => console.log("starting bar"));

const stop = new EventEmitter();
stop.on('foo', () => console.log("stopping foo"));
stop.on('bar', () => console.log("stopping bar"));

const machine = new xstate.Machine(activities.preprocess(definition));

let state = machine.initialState;

activities.handleActions(state.actions, 'stop', stop);
activities.handleActions(state.actions, 'start', start);

// TODO filter out the actions that are handled above.
console.log(state.actions);
// [ 'xstate.activity.start (foo)' ]


state = machine.transition(state, 'e');


activities.handleActions(state.actions, 'stop', stop);
activities.handleActions(state.actions, 'start', start);

console.log(state.actions);
//  [ 'xstate.activity.stop (foo)',           
//   'xstate.activity.start (foo)',          
//   'xstate.activity.start (bar)' ] 



