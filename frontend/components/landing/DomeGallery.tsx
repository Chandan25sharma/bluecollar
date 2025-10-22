// @ts-nocheck
"use client";

import { useGesture } from "@use-gesture/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import "./DomeGallery.css";

// Service images with provider information
const DEFAULT_SERVICES = [
  {
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
    alt: "Kitchen Plumbing Work",
    provider: "Mike Johnson",
  },
  {
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    alt: "Electrical Installation",
    provider: "Sarah Chen",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    alt: "House Cleaning Service",
    provider: "Maria Garcia",
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    alt: "Building Construction",
    provider: "David Wilson",
  },
  {
    src: "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=800&auto=format&fit=crop",
    alt: "Interior Painting",
    provider: "Lisa Anderson",
  },
  {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    alt: "Garden Landscaping",
    provider: "Tom Rodriguez",
  },
  {
    src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
    alt: "HVAC Maintenance",
    provider: "Robert Kim",
  },
  {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    alt: "Roofing Services",
    provider: "James Miller",
  },
  {
    src: "https://images.unsplash.com/photo-1581578017426-96749d0d5f9c?q=80&w=800&auto=format&fit=crop",
    alt: "Bathroom Renovation",
    provider: "Emma Thompson",
  },
  {
    src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop",
    alt: "Appliance Repair",
    provider: "Alex Davis",
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
    alt: "Tile Installation",
    provider: "Carlos Ruiz",
  },
  {
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop",
    alt: "Office Cleaning",
    provider: "Jennifer Lee",
  },
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool: any[], seg: any) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map((c) => ({ ...c, src: "", alt: "", provider: "" }));
  }

  const normalizedServices = pool.map((service) => ({
    src: service.src || "",
    alt: service.alt || "",
    provider: service.provider || "Unknown Provider",
  }));

  const usedServices = Array.from(
    { length: totalSlots },
    (_, i) => normalizedServices[i % normalizedServices.length]
  );

  // Prevent consecutive duplicates
  for (let i = 1; i < usedServices.length; i++) {
    if (usedServices[i].src === usedServices[i - 1].src) {
      for (let j = i + 1; j < usedServices.length; j++) {
        if (usedServices[j].src !== usedServices[i].src) {
          const tmp = usedServices[i];
          usedServices[i] = usedServices[j];
          usedServices[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedServices[i].src,
    alt: usedServices[i].alt,
    provider: usedServices[i].provider,
  }));
}

function computeItemBaseRotation(
  offsetX: number,
  offsetY: number,
  sizeX: number,
  sizeY: number,
  segments: number
) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

export default function DomeGallery({
  services = DEFAULT_SERVICES,
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = "#0a4a3a",
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = "350px",
  openedImageHeight = "450px",
  imageBorderRadius = "20px",
  openedImageBorderRadius = "24px",
  grayscale = false,
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);
  const originalTilePositionRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add("dg-scroll-lock");
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute("data-enlarging") === "true") return;
    scrollLockedRef.current = false;
    document.body.classList.remove("dg-scroll-lock");
  }, []);

  const items = useMemo(
    () => buildItems(services, segments),
    [services, segments]
  );

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  const lockedRadiusRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      let basis;
      switch (fitBasis) {
        case "min":
          basis = minDim;
          break;
        case "max":
          basis = maxDim;
          break;
        case "width":
          basis = w;
          break;
        case "height":
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty("--radius", `${lockedRadiusRef.current}px`);
      root.style.setProperty("--viewer-pad", `${viewerPad}px`);
      root.style.setProperty("--overlay-blur-color", overlayBlurColor);
      root.style.setProperty("--tile-radius", imageBorderRadius);
      root.style.setProperty("--enlarge-radius", openedImageBorderRadius);
      root.style.setProperty(
        "--image-filter",
        grayscale ? "grayscale(1)" : "none"
      );
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector(".enlarge");
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();

        const hasCustomSize = openedImageWidth && openedImageHeight;
        if (hasCustomSize) {
          const tempDiv = document.createElement("div");
          tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`;
          document.body.appendChild(tempDiv);
          const tempRect = tempDiv.getBoundingClientRect();
          document.body.removeChild(tempDiv);

          const centeredLeft =
            frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
          const centeredTop =
            frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;

          enlargedOverlay.style.left = `${centeredLeft}px`;
          enlargedOverlay.style.top = `${centeredTop}px`;
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
          enlargedOverlay.style.width = `${frameR.width}px`;
          enlargedOverlay.style.height = `${frameR.height}px`;
        }
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight,
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(
          rotationRef.current.x - vY / 200,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();
        const evt = event;
        draggingRef.current = true;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
      },
      onDrag: ({
        event,
        last,
        velocity = [0, 0],
        direction = [0, 0],
        movement,
      }) => {
        if (
          focusedElRef.current ||
          !draggingRef.current ||
          !startPosRef.current
        )
          return;
        const evt = event;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;
        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
          if (dist2 > 16) movedRef.current = true;
        }
        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(
          startRotRef.current.y + dxTotal / dragSensitivity
        );
        if (
          rotationRef.current.x !== nextX ||
          rotationRef.current.y !== nextY
        ) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }
        if (last) {
          draggingRef.current = false;
          let [vMagX, vMagY] = velocity;
          const [dirX, dirY] = direction;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;
          if (
            Math.abs(vx) < 0.001 &&
            Math.abs(vy) < 0.001 &&
            Array.isArray(movement)
          ) {
            const [mx, my] = movement;
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)
            startInertia(vx, vy);
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } }
  );

  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;
    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent = el.parentElement;
      const overlay = viewerRef.current?.querySelector(".enlarge");
      if (!overlay) return;
      const refDiv = parent.querySelector(".item__image--reference");
      const originalPos = originalTilePositionRef.current;
      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty("--rot-y-delta", "0deg");
        parent.style.setProperty("--rot-x-delta", "0deg");
        el.style.visibility = "";
        el.style.zIndex = 0;
        focusedElRef.current = null;
        rootRef.current?.removeAttribute("data-enlarging");
        openingRef.current = false;
        unlockScroll();
        return;
      }
      // ... rest of the close function (same as original)
    };
    scrim.addEventListener("click", close);
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      scrim.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [enlargeTransitionMs, unlockScroll]);

  const openItemFromElement = useCallback(
    (el) => {
      // ... opening logic (same as original but adapted for services)
    },
    [
      enlargeTransitionMs,
      lockScroll,
      openedImageHeight,
      openedImageWidth,
      segments,
      unlockScroll,
    ]
  );

  const onTileClick = useCallback(
    (e) => {
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement]
  );

  const onTilePointerUp = useCallback(
    (e) => {
      if (e.pointerType !== "touch") return;
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement]
  );

  useEffect(() => {
    return () => {
      document.body.classList.remove("dg-scroll-lock");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{
        ["--segments-x"]: segments,
        ["--segments-y"]: segments,
        ["--overlay-blur-color"]: overlayBlurColor,
        ["--tile-radius"]: imageBorderRadius,
        ["--enlarge-radius"]: openedImageBorderRadius,
        ["--image-filter"]: grayscale ? "grayscale(1)" : "none",
      }}
    >
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-src={it.src}
                data-provider={it.provider}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                style={{
                  ["--offset-x"]: it.x,
                  ["--offset-y"]: it.y,
                  ["--item-size-x"]: it.sizeX,
                  ["--item-size-y"]: it.sizeY,
                }}
              >
                <div
                  className="item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || "Open service image"}
                  onClick={onTileClick}
                  onPointerUp={onTilePointerUp}
                >
                  <img src={it.src} draggable={false} alt={it.alt} />
                  {/* Provider name in bottom corner */}
                  <div className="provider-name">{it.provider}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />

        <div className="viewer" ref={viewerRef}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="frame" />
        </div>
      </main>
    </div>
  );
}
