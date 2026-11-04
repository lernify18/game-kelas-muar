// Runs only for the routes in wrangler.jsonc `assets.run_worker_first` (the class video); every other path is served
// straight from Static Assets without invoking this script.
import { withRangeSupport } from './range.js';

export default {
  async fetch(request, env) {
    return withRangeSupport(request, await env.ASSETS.fetch(request));
  },
};
