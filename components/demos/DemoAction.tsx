import { cloneElement, type ReactElement } from "react";

export function DemoAction({ children }: { children: ReactElement<{ "data-puchup-demo-action"?: string }> }) {
  return cloneElement(children, { "data-puchup-demo-action": "" });
}
