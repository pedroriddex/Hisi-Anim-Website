"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardBody, Snippet } from "@heroui/react";

type Effect = {
  cls: string;
  label: string;
  /** "reveal" = clip-path (replay by re-clipping); "keyframe" = blur/scale/zoom. */
  kind: "reveal" | "keyframe";
  /** Animation/transition duration in ms — used to flip the play icon back. */
  duration: number;
};

const EFFECTS: { group: string; items: Effect[] }[] = [
  {
    group: "Entrance effects",
    items: [
      { cls: "ha--scrollBlur", label: "Blur (vertical)", kind: "keyframe", duration: 2400 },
      { cls: "ha--scrollBlurLeft", label: "Blur from the left", kind: "keyframe", duration: 2400 },
      { cls: "ha--scrollBlurRight", label: "Blur from the right", kind: "keyframe", duration: 2400 },
      { cls: "ha--scrollScale", label: "Scale in", kind: "keyframe", duration: 1600 },
      { cls: "ha--scrollZoom", label: "Background zoom", kind: "keyframe", duration: 2000 },
    ],
  },
  {
    group: "Clip-path reveals",
    items: [
      { cls: "ha--clipPathRight", label: "Reveal from the right", kind: "reveal", duration: 1000 },
      { cls: "ha--clipPathLeft", label: "Reveal from the left", kind: "reveal", duration: 1000 },
      { cls: "ha--clipPathTop", label: "Reveal from the top", kind: "reveal", duration: 1000 },
      { cls: "ha--clipPathBottom", label: "Reveal from the bottom", kind: "reveal", duration: 1000 },
    ],
  },
];

/**
 * Trigger the effect on a swatch element.
 * - keyframe effects: toggle `.ha--play` (restart with a reflow).
 * - reveal effects: add `.ha--replay` to jump to the clipped state, then
 *   remove it next frame so it transitions back open.
 */
function playEffect(el: HTMLElement, kind: Effect["kind"]) {
  if (kind === "keyframe") {
    el.classList.remove("ha--play");
    void el.offsetWidth; // reflow to restart the animation
    el.classList.add("ha--play");
    return;
  }
  // reveal
  el.classList.add("ha--replay"); // closed, no transition
  void el.offsetWidth;
  requestAnimationFrame(() => {
    el.classList.remove("ha--replay"); // animate back to the open resting state
  });
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 translate-x-px">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ExampleCard({ effect }: { effect: Effect }) {
  const swatchRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Keep the latest values in refs so the run() identity used by the observer
  // effect never goes stale (the effect runs once with []).
  const durationRef = useRef(effect.duration);
  const kindRef = useRef(effect.kind);
  durationRef.current = effect.duration;
  kindRef.current = effect.kind;

  const run = useCallback(() => {
    const el = swatchRef.current;
    if (!el) return;
    setIsPlaying(true);
    playEffect(el, kindRef.current);
    // Reset by a timer keyed to the real duration: keyframes like blurInOut
    // fire several animationend events, so listening for them is unreliable.
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, durationRef.current + 200);
  }, []);

  useEffect(() => {
    const el = swatchRef.current;
    if (!el) return;

    // Play once when the card first scrolls into view.
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [run]);

  return (
    <Card
      shadow="none"
      radius="lg"
      className="border border-default-100 bg-content1"
    >
      <CardBody className="gap-4 p-5">
        <div className="group relative">
          <div
            ref={swatchRef}
            className={`demo-swatch hisi-anim ${effect.cls}`}
            onClick={run}
            role="button"
            tabIndex={0}
            aria-label={`Play ${effect.label}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                run();
              }
            }}
          >
            {effect.label}
          </div>

          {/* Play affordance: shown while the card is at rest, hidden while the
              animation runs. pointer-events-none so clicks fall through to the
              swatch underneath. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              isPlaying ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/20 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
              <PlayIcon />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Snippet
            hideSymbol
            size="sm"
            variant="flat"
            radius="sm"
            classNames={{
              base: "bg-default-100 min-w-0",
              pre: "font-mono text-xs text-default-600 truncate",
            }}
          >
            {effect.cls}
          </Snippet>
          <button
            type="button"
            onClick={run}
            className="shrink-0 text-xs font-medium text-default-400 transition-colors hover:text-default-700"
          >
            Replay
          </button>
        </div>
      </CardBody>
    </Card>
  );
}

export function ClassGallery() {
  return (
    <div className="flex flex-col gap-12">
      {EFFECTS.map((section) => (
        <div key={section.group}>
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-default-400">
            {section.group}
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((effect) => (
              <ExampleCard key={effect.cls} effect={effect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
