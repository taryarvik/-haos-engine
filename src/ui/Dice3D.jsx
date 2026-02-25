import React, { useMemo } from "react";
import { motion } from "framer-motion";

function PipsFace({ n }) {
  const dots = useMemo(() => {
    const map = {
      1: [[2, 2]],
      2: [[1, 1], [3, 3]],
      3: [[1, 1], [2, 2], [3, 3]],
      4: [[1, 1], [1, 3], [3, 1], [3, 3]],
      5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
      6: [[1, 1], [1, 2], [1, 3], [3, 1], [3, 2], [3, 3]],
    };
    return map[n] ?? map[1];
  }, [n]);

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:"repeat(3, 1fr)",
      gridTemplateRows:"repeat(3, 1fr)",
      gap: 10,
      width:"100%",
      height:"100%",
      padding: 18
    }}>
      {[...Array(9)].map((_, i) => {
        const r = Math.floor(i / 3) + 1;
        const c = (i % 3) + 1;
        const on = dots.some(([rr, cc]) => rr === r && cc === c);
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"center", opacity: on ? 1 : 0 }}>
            <div style={{
              width: 18,
              height: 18,
              borderRadius: 6,
              background: "linear-gradient(145deg, rgba(255,255,255,.95), rgba(233,201,129,.75))",
              boxShadow: "0 0 18px rgba(168,85,247,.75), 0 0 26px rgba(233,201,129,.28)",
              clipPath: "polygon(50% 0%, 92% 50%, 50% 100%, 8% 50%)",
              transform: on ? "rotate(45deg) scale(1)" : "rotate(45deg) scale(.82)"
            }} />
          </div>
        );
      })}
    </div>
  );
}

function Face({ n, style }) {
  return (
    <div
      style={{
        position:"absolute",
        inset:0,
        borderRadius: 18,
        background: "linear-gradient(145deg, rgba(168,85,247,.92), rgba(46,16,99,.98)), radial-gradient(circle at 30% 30%, rgba(255,255,255,.12), transparent 55%), repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 2px, transparent 2px 10px)",
        border: "1px solid rgba(0,0,0,.55)",
        outline: "1px solid rgba(255,255,255,.10)",
        boxShadow: "inset 0 0 22px rgba(255,255,255,.10), 0 18px 40px rgba(0,0,0,.35)",
        ...style
      }}
    >
      <PipsFace n={n} />
      <div style={{
        position:"absolute",
        inset:0,
        borderRadius: 18,
        background:"radial-gradient(closest-side at 30% 25%, rgba(255,255,255,.22), transparent 55%)",
        pointerEvents:"none"
      }} />
    </div>
  );
}

/**
 * Dice3D:
 * - visual imitation of real 3D cube (6 faces)
 * - rotation controlled externally by cubeRotation {x,y}
 */
export default function Dice3D({
  cubeRotation = { x: 0, y: 0 },
  isRolling = false,
  disabled = false,
  onClick,
  label = "CHAOS ROLL",
  jackpotGlow = false
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn"
      style={{ borderRadius: 22, padding: 14, width: 210 }}
      aria-label={label}
    >
      <div style={{ perspective: 1400, width: 156, height: 156, margin: "0 auto" }}>
        <motion.div
          style={{
            width: 156,
            height: 156,
            position: "relative",
            transformStyle: "preserve-3d",
            filter: jackpotGlow ? "drop-shadow(0 0 28px rgba(233,201,129,.35)) drop-shadow(0 0 20px rgba(168,85,247,.55))" : "drop-shadow(0 0 18px rgba(168,85,247,.45))",
          }}
          animate={{
            rotateX: cubeRotation.x,
            rotateY: cubeRotation.y,
            rotateZ: isRolling ? [0, 8, -10, 6, -6, 0] : 0,
            scale: isRolling ? [1, 1.02, 1] : 1
          }}
          transition={{
            duration: isRolling ? 0.22 : 0.75,
            ease: isRolling ? "linear" : [0.2, 0.8, 0.2, 1]
          }}
        >
          {/* Face positions (cube size 140 => half = 70) */}
          <Face n={1} style={{ transform: "rotateY(0deg) translateZ(78px)" }} />
          <Face n={2} style={{ transform: "rotateX(90deg) translateZ(78px)" }} />
          <Face n={3} style={{ transform: "rotateY(-90deg) translateZ(78px)" }} />
          <Face n={4} style={{ transform: "rotateY(90deg) translateZ(78px)" }} />
          <Face n={5} style={{ transform: "rotateX(-90deg) translateZ(78px)" }} />
          <Face n={6} style={{ transform: "rotateX(180deg) translateZ(78px)" }} />
        </motion.div>
      </div>

      <div className="label" style={{ fontSize: 10, marginTop: 10, textAlign: "center" }}>
        {label}
      </div>
    </button>
  );
}
