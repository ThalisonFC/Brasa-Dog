import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(active: boolean, rootRef: RefObject<HTMLElement | null>) {
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !rootRef.current) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    const root = rootRef.current;
    const focusables = root.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusables[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !root) return;
      const nodes = root.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (nodes.length === 0) return;
      const list = Array.from(nodes).filter((el) => !el.hasAttribute('disabled'));
      const idx = list.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey) {
        if (idx <= 0) {
          e.preventDefault();
          list[list.length - 1]?.focus();
        }
      } else if (idx === list.length - 1) {
        e.preventDefault();
        list[0]?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      prevFocus.current?.focus?.();
    };
  }, [active, rootRef]);
}
