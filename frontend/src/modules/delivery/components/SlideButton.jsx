import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Flame, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';

export default function SlideButton({ 
  onConfirm, 
  text = 'Slide to Detonate & Accept Order', 
  completedText = 'Order Detonated & Accepted!',
  variant = 'detonate', // 'detonate', 'deliver', 'danger'
  disabled = false 
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [0, 200],
    variant === 'detonate'
      ? ['#1e40af', '#2563eb'] // Warm blue to bright blue
      : variant === 'deliver'
      ? ['#059669', '#10b981'] // Emerald green
      : ['#dc2626', '#ef4444']  // Red
  );

  const handleDragEnd = (_, info) => {
    if (disabled || isCompleted) return;
    if (info.offset.x > 140) {
      setIsCompleted(true);
      if (onConfirm) onConfirm();
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100 p-1 border border-slate-200 shadow-inner select-none">
      <motion.div
        style={{ background }}
        className="relative h-14 rounded-xl flex items-center justify-center transition-colors shadow-md"
      >
        {/* Background text / guide */}
        <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2 drop-shadow-sm px-10 text-center">
          {isCompleted ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-300 animate-bounce" />
              {completedText}
            </>
          ) : (
            <>
              {variant === 'detonate' && <Flame className="w-4 h-4 text-amber-300 animate-pulse" />}
              {text}
              <ChevronRight className="w-4 h-4 text-white/70 animate-pulse" />
            </>
          )}
        </span>

        {/* Sliding Thumb Handle */}
        {!isCompleted && (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 200 }}
            dragElastic={0.1}
            dragSnapToOrigin={!isCompleted}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="absolute left-1 top-1 bottom-1 w-12 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing border border-slate-200 z-10 hover:bg-slate-50 transition-colors"
          >
            {variant === 'detonate' ? (
              <Flame className="w-6 h-6 text-blue-600" />
            ) : variant === 'deliver' ? (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
