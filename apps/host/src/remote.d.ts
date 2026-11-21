// Contract with the remote's "./Greeting" expose (see apps/remote/src/federation.ts).
declare module "remote/Greeting" {
  import type { ComponentType } from "react";

  const Greeting: ComponentType;
  export default Greeting;
}
