/*
this constants.js file should be deprecated!
Use the `kolibri/coreVue/vuex/constants` instead.
*/

// a name for every URL pattern
const PageNames = {
  EXPLORE_ROOT: 'EXPLORE_ROOT',
  EXPLORE_CHANNEL: 'EXPLORE_CHANNEL',
  EXPLORE_TOPIC: 'EXPLORE_TOPIC',
  EXPLORE_CONTENT: 'EXPLORE_CONTENT',
  LEARN_ROOT: 'LEARN_ROOT',
  LEARN_CHANNEL: 'LEARN_CHANNEL',
  LEARN_CONTENT: 'LEARN_CONTENT',
  SCRATCHPAD: 'SCRATCHPAD',
  CONTENT_UNAVAILABLE: 'CONTENT_UNAVAILABLE',
};

// switch between modes
const PageModes = {
  EXPLORE: 'EXPLORE',
  LEARN: 'LEARN',
};

module.exports = {
  PageNames,
  PageModes,
};
