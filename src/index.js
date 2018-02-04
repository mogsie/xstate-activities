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

exports.filterActions = function(allActions) {
  const actions = allActions
        .filter(item => !item.startsWith(start))
        .filter(item => !item.startsWith(stop));
  const toStop = allActions
        .filter(item => item.startsWith(stop))
        .map(item => item.substring(stop.length));
  const toStart = allActions
        .filter(item => item.startsWith(start))
        .map(item => item.substring(start.length));
  return {toStop, toStart, actions};
};

