import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CELL = 44;

function Reel({ startValue, targetValue, spinning, loops, spinKey }) {
  const baseOffset = useMemo(() => 12 + Math.floor(Math.random() * 12), []);
  const strip = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 72; i++) arr.push((i % 6) + 1);
    return arr;
  }, []);

  const startIdx = baseOffset + ((startValue - 1) % 6);
  const delta = (targetValue - startValue + 6) % 6;
  const totalSteps = loops * 6 + delta;

  const yStart = -startIdx * CELL;
  const yEnd = -(startIdx + totalSteps) * CELL;

  return (
    <div style={{
      width: 78,
      height: 132,
      borderRadius: 18,
      overflow: "hidden",
      background: "rgba(0,0,0,.55)",
      border: "1px solid rgba(255,255,255,.10)",
      boxShadow: "inset 0 0 18px rgba(0,0,0,.6), 0 0 24px rgba(168,85,247,.25)",
      position: "relative"
    }}>
      <div style={{
        position:"absolute", left:0, right:0, top:"50%", transform:"translateY(-50%)",
        height: 46,
        borderTop: "1px solid rgba(255,255,255,.10)",
        borderBottom: "1px solid rgba(255,255,255,.10)",
        background: "linear-gradient(90deg, rgba(168,85,247,.12), rgba(233,201,129,.10), rgba(168,85,247,.12))",
        pointerEvents:"none"
      }} />
      <motion.div
        key={spinKey}
        initial={{ y: yStart }}
        animate={{ y: spinning ? yEnd : yStart }}
        transition={{ duration: spinning ? 1.05 : 0.001, ease: "linear" }}
      >
        {strip.map((n, i) => (
          <div key={i} style={{
            height: CELL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 900,
            color: "rgba(255,245,215,1)",
            textShadow: "0 0 12px rgba(168,85,247,.65), 0 0 18px rgba(233,201,129,.25)"
          }}>
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function JackpotCasinoModal({ open, onResolve, baseMult }) {
  const [spinning, setSpinning] = useState(false);
  const [vals, setVals] = useState(() => [1,1,1].map(() => 1 + Math.floor(Math.random() * 6)));
  const [targets, setTargets] = useState(vals);
  const [spinKey, setSpinKey] = useState(0);

  const sixCount = vals.filter(v => v === 6).length;
  const mappedMult = 3 + sixCount;
  const bonus = mappedMult - 3;

  const spin = () => {
    if (spinning) return;

    const nextTargets = [1,1,1].map(() => 1 + Math.floor(Math.random() * 6));
    setTargets(nextTargets);

    setSpinning(true);
    setSpinKey(k => k + 1);

    setTimeout(() => {
      setVals(nextTargets);
      setSpinning(false);
    }, 1120);
  };

  const apply = () => {
    if (spinning) return;
    const finalSixCount = vals.filter(v => v === 6).length;
    onResolve({ vals, sixCount: finalSixCount, bonus: finalSixCount });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 80 }}
        >
          <motion.div
            className="modal"
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{ maxWidth: 520 }}
          >
            <div style={{ textAlign:"center", marginBottom: 10 }}>
              <div className="h2" style={{ marginBottom: 6 }}>🎰 JACKPOT BONUS</div>
              <div className="muted" style={{ fontSize: 12 }}>
                0×6 → x3 | 1×6 → x4 | 2×6 → x5 | 3×6 → x6
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Base jackpot: x{baseMult} • bonus: +{bonus} • bonus-mult: x{mappedMult}
              </div>
            </div>

            <div style={{ display:"flex", gap: 12, justifyContent:"center", margin: "14px 0 10px" }}>
              <Reel startValue={vals[0]} targetValue={targets[0]} spinning={spinning} loops={5} spinKey={spinKey} />
              <Reel startValue={vals[1]} targetValue={targets[1]} spinning={spinning} loops={6} spinKey={spinKey} />
              <Reel startValue={vals[2]} targetValue={targets[2]} spinning={spinning} loops={7} spinKey={spinKey} />
            </div>

            <div style={{ display:"flex", gap: 10, justifyContent:"center", marginTop: 8 }}>
              <button className="btn" onClick={spin} disabled={spinning}>
                {spinning ? "SPINNING..." : "SPIN"}
              </button>
              <button className="btn btn-accent" onClick={apply} disabled={spinning}>
                APPLY
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
