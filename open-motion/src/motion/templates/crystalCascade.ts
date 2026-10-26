import { easingPreset } from "@openmotion/shared";
import { draft, kf, type TemplateDef } from "./helper.js";

/**
 * Crystal Cascade — an entrance where crystalline shards tumble down in a
 * staggered cascade, each one catching the light as it lands, until the
 * full form assembles. A sibling of Crystal Shard / Crystalline Growth:
 * same export shape, but the motion is a descending, staggered cascade
 * rather than a converging assembly or a branching growth.
 *
 * Created to restore the template imported by
 * open-motion/src/motion/templates/index.ts, which referenced this file
 * even though it was never committed upstream.
 */
export const crystalCascadeTemplate: TemplateDef = {
  id: "tpl-crystal-cascade",
  name: "Crystal Cascade",
  category: "entrance",
  description:
    "Crystalline entrance where shard pieces cascade down in a staggered sequence, each catching light as it lands, until the full crystal form assembles.",
  tags: ["crystal", "cascade", "stagger", "assemble", "3d", "geometric", "entrance", "perspective"],
  build: () => [
    draft("Cascade Stage", {
      durationMs: 1800,
      easing: easingPreset("ease-in-out"),
      keyframes: [
        kf(0, { opacity: 0 }),
        kf(0.1, { opacity: 1 }),
        kf(1, { opacity: 1 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "320px",
        height: "320px",
        backgroundColor: "#0a0a0a",
        borderRadius: "12px",
        perspective: "900px",
        transformStyle: "preserve-3d",
        position: "relative",
        overflow: "hidden",
      },
    }),
    draft("Cascade Shard One", {
      durationMs: 1100,
      delayMs: 0,
      easing: easingPreset("ease-out"),
      keyframes: [
        kf(0, { rotateX: -90, rotateY: 45, translateY: -160, translateZ: -160, opacity: 0 }),
        kf(0.5, { rotateX: -30, rotateY: 15, translateY: -40, translateZ: -40, opacity: 0.7 }),
        kf(1, { rotateX: 0, rotateY: 0, translateY: 0, translateZ: 0, opacity: 1 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "0",
        height: "0",
        borderLeft: "60px solid transparent",
        borderRight: "60px solid transparent",
        borderBottom: "100px solid rgba(255,255,255,0.85)",
        position: "absolute",
        top: "30px",
        left: "100px",
        transformOrigin: "center bottom",
        filter: "drop-shadow(0 0 6px rgba(180,200,255,0.4))",
      },
    }),
    draft("Cascade Shard Two", {
      durationMs: 1100,
      delayMs: 180,
      easing: easingPreset("ease-out"),
      keyframes: [
        kf(0, { rotateX: 90, rotateY: -60, translateY: -120, translateZ: -160, opacity: 0 }),
        kf(0.5, { rotateX: 25, rotateY: -20, translateY: -30, translateZ: -40, opacity: 0.7 }),
        kf(1, { rotateX: 0, rotateY: 0, translateY: 0, translateZ: 0, opacity: 1 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "0",
        height: "0",
        borderRight: "60px solid transparent",
        borderTop: "100px solid rgba(235,235,235,0.75)",
        position: "absolute",
        top: "150px",
        left: "100px",
        transformOrigin: "center top",
        filter: "drop-shadow(0 0 6px rgba(180,200,255,0.3))",
      },
    }),
    draft("Cascade Shard Three", {
      durationMs: 1100,
      delayMs: 360,
      easing: easingPreset("ease-out"),
      keyframes: [
        kf(0, { rotateX: 90, rotateY: 60, translateY: -120, translateZ: -160, opacity: 0 }),
        kf(0.5, { rotateX: 25, rotateY: 20, translateY: -30, translateZ: -40, opacity: 0.7 }),
        kf(1, { rotateX: 0, rotateY: 0, translateY: 0, translateZ: 0, opacity: 1 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "0",
        height: "0",
        borderLeft: "60px solid transparent",
        borderTop: "100px solid rgba(245,245,245,0.8)",
        position: "absolute",
        top: "150px",
        left: "160px",
        transformOrigin: "center top",
        filter: "drop-shadow(0 0 6px rgba(180,200,255,0.3))",
      },
    }),
    draft("Cascade Core", {
      durationMs: 800,
      delayMs: 650,
      easing: easingPreset("ease-out"),
      keyframes: [
        kf(0, { rotateY: 180, scale: 0.1, opacity: 0 }),
        kf(0.6, { rotateY: 30, scale: 0.8, opacity: 0.6 }),
        kf(1, { rotateY: 0, scale: 1, opacity: 1 }),
      ],
      style: {
        _content: "",
        _tag: "div",
        width: "28px",
        height: "28px",
        backgroundColor: "#ffffff",
        boxShadow: "0 0 14px 4px rgba(150,180,255,0.7), 0 0 28px 8px rgba(150,180,255,0.3)",
        position: "absolute",
        top: "146px",
        left: "146px",
        transformOrigin: "center center",
      },
    }),
  ],
};
