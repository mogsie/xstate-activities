const start = 'xstate.activity.start ';
const stop = 'xstate.activity.stop ';

exports.preprocess = function(definition) {
  const definitionCopy = {};
  copyStates(definition, definitionCopy);
  makeActivities(definitionCopy);
  return definitionCopy;
}



function copyStates(src, target) {
  Object.keys(src).forEach(key => {
    const t = typeof src[key];
    if (t == 'string' || t == 'function' || t == 'number') {
      target[key] = src[key]; return
    }
    if (Array.isArray(src[key])) {
      target[key] = [];
    }
    else {
      target[key] = {};
    }
    copyStates(src[key], target[key]);
  });
}


function actionify(state, entryexit, startstop) {
    if (! state[entryexit]) {
      state[entryexit] = [];
    }
    if (typeof state[entryexit] == 'string') {
      state[entryexit] = [ state[entryexit] ];
    }
    if (typeof state.activities == 'string') {
      state.activities = [ state.activities ];
    }
    state.activities.forEach(item => state[entryexit].push(`${startstop}${item}`));
}

function makeActivities(state) {
  if (state.activities) {
    actionify(state, 'onEntry', start);
    actionify(state, 'onExit', stop);
    delete state.activities;
  }

  if (state.states) {
    Object.keys(state.states).forEach((key) => makeActivities(state.states[key]));
  }
  return state;
}

exports.handleActions = function(actions, startstop, emitter) {
  const filter = (startstop == 'start') ? start : (startstop == 'stop') ? stop : undefined;
  if (! filter) throw new Error("use start or stop please!");

  actions
    .filter(item => item.startsWith(filter))
    .map(item => item.substring(filter.length))
    .forEach(item => emitter.emit(item));
};

