/**
 * The services hub renders one module (tab) at a time, so in-page CTAs can no
 * longer rely on the target element already being in the DOM. Ask the page to
 * switch to the tab that owns `id`, then scroll once it has rendered.
 */
export const SERVICES_GOTO_EVENT = "services:goto";

export function goToSection(id: string) {
  window.dispatchEvent(new CustomEvent<string>(SERVICES_GOTO_EVENT, { detail: id }));
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}
