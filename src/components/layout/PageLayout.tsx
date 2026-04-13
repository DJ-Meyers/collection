import { createContext, useContext, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { useCollectionOwner } from "../../api/queries";

const NAV_HEIGHT = 53;
const PageHeaderPortalContext = createContext<HTMLDivElement | null>(null);
const StickyOffsetContext = createContext<number>(0);

export function useStickyOffset() {
  return useContext(StickyOffsetContext);
}

export function PageHeader({ children }: { children: React.ReactNode }) {
  const container = useContext(PageHeaderPortalContext);
  if (!container) return null;
  return createPortal(children, container);
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  const { data: ownerName } = useCollectionOwner();
  const [headerEl, setHeaderEl] = useState<HTMLDivElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const [hasContent, setHasContent] = useState(false);
  const [stickyOffset, setStickyOffset] = useState(NAV_HEIGHT);
  const headerWrapperRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const headerWrapperCallback = useCallback((node: HTMLDivElement | null) => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    headerWrapperRef.current = node;
    if (node) {
      const update = () => {
        setStickyOffset(NAV_HEIGHT + node.offsetHeight);
      };
      resizeObserverRef.current = new ResizeObserver(update);
      resizeObserverRef.current.observe(node);
      update();
    }
  }, []);

  const headerRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    setHeaderEl(node);

    if (node) {
      setHasContent(node.childNodes.length > 0);
      observerRef.current = new MutationObserver(() => {
        setHasContent(node.childNodes.length > 0);
      });
      observerRef.current.observe(node, { childList: true });
    }
  }, []);

  return (
    <PageHeaderPortalContext.Provider value={headerEl}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <nav className="sticky top-0 z-20 flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold text-gray-900">
                {ownerName ? `${ownerName}'s Collection` : "Pokemon Collection"}
              </Link>
            </div>
          </div>
        </nav>
        <div
          ref={headerWrapperCallback}
          className={`flex-shrink-0 ${hasContent ? "sticky z-30 bg-gray-50" : ""}`}
          style={hasContent ? { top: NAV_HEIGHT } : undefined}
        >
          <div
            ref={headerRef}
            className="max-w-4xl mx-auto px-4 py-3 space-y-3"
          />
        </div>
        <main className="flex-1">
          <StickyOffsetContext.Provider value={stickyOffset}>
            <div className="max-w-4xl mx-auto px-4 pt-2 pb-6">{children}</div>
          </StickyOffsetContext.Provider>
        </main>
      </div>
    </PageHeaderPortalContext.Provider>
  );
}
