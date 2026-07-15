"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode, forwardRef, CSSProperties } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.9,
  once = true,
  threshold = 0.18,
}: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const directionMap = {
    up: { y: 52, x: 0 },
    down: { y: -52, x: 0 },
    left: { y: 0, x: 48 },
    right: { y: 0, x: -48 },
    none: { y: 0, x: 0 },
  };

  const { x, y } = directionMap[direction];

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Soft blur veil — lifts on enter (works on any background) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        initial={{ opacity: 0.85, backdropFilter: "blur(10px)" }}
        animate={
          inView
            ? { opacity: 0, backdropFilter: "blur(0px)" }
            : { opacity: 0.85, backdropFilter: "blur(10px)" }
        }
        transition={{ duration: duration * 0.9, delay, ease: EASE }}
      />
      <motion.div
        initial={{ opacity: 0, x, y, filter: "blur(8px)" }}
        animate={
          inView
            ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
            : { opacity: 0, x, y, filter: "blur(8px)" }
        }
        transition={{ duration, delay, ease: EASE }}
        className="relative z-[2]"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
  style?: CSSProperties;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  function StaggerContainer(
    { children, className = "", staggerDelay = 0.12, threshold = 0.15, style },
    ref
  ) {
    const [inViewRef, inView] = useInView({
      triggerOnce: true,
      threshold,
    });

    const setRefs = (node: HTMLDivElement | null) => {
      inViewRef(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <motion.div
        ref={setRefs}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: staggerDelay },
          },
        }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }
);

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 48, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.85, ease: EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
