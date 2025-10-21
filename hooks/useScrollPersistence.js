import { useEffect, useRef, useState } from 'react';

export function useScrollPersistence({
  storageKey,
  items = [],
  devMode = false,
  listRef = null,
  itemRefs = null,
  setScrollToIdx = null,
  setHighlightedIdx = null,
}) {
  const [restoredScroll, setRestoredScroll] = useState(null);

  const getMostVisibleIdx = () => {
    if (!itemRefs || !itemRefs.current) return null;
    let maxVisible = 0;
    let bestIdx = null;
    
    itemRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const visible = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      );
      if (visible > maxVisible) {
        maxVisible = visible;
        bestIdx = idx;
      }
    });
    
    return bestIdx;
  };

  const saveScrollPosition = (pos) => {
    try {
      if (typeof window === 'undefined') return;
      
      if (!pos || pos.index === null || pos.index === undefined) {
        localStorage.removeItem(storageKey);
      } else {
        const out = { index: Number(pos.index) };
        if (pos.offset !== undefined && pos.offset !== null) {
          out.offset = Number(pos.offset);
        }
        out.ts = Date.now();
        localStorage.setItem(storageKey, JSON.stringify(out));
      }
    } catch (e) {
    }
  };

  const readSavedScrollIndex = () => {
    try {
      if (typeof window === 'undefined') return null;
      
      const v = localStorage.getItem(storageKey);
      if (!v) return null;
      
      try {
        const parsed = JSON.parse(v);
        if (!parsed || typeof parsed !== 'object') return null;
        
        const idx = Number(parsed.index);
        if (!Number.isFinite(idx)) return null;
        
        const offset = parsed.offset !== undefined ? Number(parsed.offset) : null;
        return {
          index: idx,
          offset: Number.isFinite(offset) ? offset : null,
        };
      } catch (e) {
        const n = Number(v);
        return Number.isFinite(n) ? { index: n, offset: null } : null;
      }
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let rafId = null;
    let intervalId = null;

    const persist = () => {
      try {
        let idx = null;
        let offset = null;

        if (devMode) {
          const bestIdx = getMostVisibleIdx();
          if (bestIdx !== null && bestIdx !== undefined) {
            idx = bestIdx;
            offset = window.pageYOffset || window.scrollY || 0;
          }
        } else if (listRef && listRef.current) {
          const container =
            listRef.current && listRef.current._outerRef
              ? listRef.current._outerRef
              : listRef.current;

          if (container && container.querySelector) {
            const visible = Array.from(container.querySelectorAll('[data-index]'));
            let best = null;
            let bestVisible = 0;
            
            visible.forEach((el) => {
              const rect = el.getBoundingClientRect();
              const vis = Math.max(
                0,
                Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
              );
              if (vis > bestVisible) {
                bestVisible = vis;
                best = el;
              }
            });
            
            if (best) idx = Number(best.getAttribute('data-index'));
          }

          try {
            if (container && typeof container.scrollTop === 'number') {
              offset = container.scrollTop;
            }
          } catch (e) {}
        } else if (itemRefs && itemRefs.current) {
          const bestIdx = getMostVisibleIdx();
          if (bestIdx !== null && bestIdx !== undefined) {
            idx = bestIdx;
            offset = window.pageYOffset || window.scrollY || 0;
          }
        }

        if (idx !== null && idx !== undefined) {
          saveScrollPosition({ index: idx, offset });
        }
      } catch (e) {
      }
    };

    intervalId = window.setInterval(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => persist());
    }, 2000);

    const onUnload = () => persist();
    window.addEventListener('beforeunload', onUnload);

    rafId = requestAnimationFrame(() => persist());

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [devMode, listRef, itemRefs, storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (items.length === 0) return;
    
    const saved = readSavedScrollIndex();
    if (saved === null) return;
    
    setRestoredScroll(saved);
    
    const t = window.setTimeout(() => {
      try {
        const targetIdx = Math.max(0, Math.floor(Number(saved.index)));
        if (setScrollToIdx) setScrollToIdx(targetIdx);
        if (setHighlightedIdx) setHighlightedIdx(targetIdx);
      } catch (e) {
      }
    }, 300);
    
    return () => clearTimeout(t);
  }, [items.length, storageKey]);

  useEffect(() => {
    if (!restoredScroll) return;

    try {
      const { index, offset } = restoredScroll || {};
      if (offset == null) return;

      if (listRef && listRef.current) {
        const container =
          listRef.current && listRef.current._outerRef
            ? listRef.current._outerRef
            : listRef.current;

        if (container && typeof container.scrollTop === 'number') {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              try {
                const top = Math.max(
                  0,
                  Math.min(Number(offset), container.scrollHeight || Number(offset))
                );
                container.scrollTop = top;
              } catch (e) {
              }
            })
          );
        }
      } else if (itemRefs && itemRefs.current && itemRefs.current[index]) {
        const el = itemRefs.current[index];
        if (el && typeof el.getBoundingClientRect === 'function') {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              try {
                const savedAbsoluteTop = Number(offset);
                window.scrollTo({ top: savedAbsoluteTop, left: 0, behavior: 'auto' });
              } catch (e) {
              }
            })
          );
        }
      }
    } catch (e) {
    }

    setRestoredScroll(null);
  }, [restoredScroll, listRef, itemRefs]);

  return {
    getMostVisibleIdx,
    saveScrollPosition,
    readSavedScrollIndex,
  };
}
