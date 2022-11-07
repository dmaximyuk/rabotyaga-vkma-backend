// Types
import { TDebug, TMethods } from "../../../engine/types";

// Modules
import debug from "./debug";

export default ((): TMethods => {
  const methods: TMethods = {
    debug: (el: TDebug) => debug(el),
  };

  return methods;
})();
