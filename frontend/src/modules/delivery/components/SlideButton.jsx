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
    [0, 240],
    variant === 'detonate'
      ? ['#1e40af', '#2563eb']
      : variant === 'deliver'
      ? ['#059669', '#10b981']
      : ['#dc2626', '#ef4444']
  );

  const handleDragEnd = (_, info) => {
    if (disabled || isCompleted) return;
    if (info.offset.x > 150) {
      setIsCompleted(true);
      if (onConfirm) onConfirm();
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100 p-1.5 border border-slate-200 select-none">
      <motion.div
        style={{ background }}
        className="relative h-16 rounded-xl flex items-center justify-center transition-colors"
      >
        {/* Background text / guide */}
        <span className="text-white font-black text-base sm:text-lg tracking-wide flex items-center gap-2.5 px-12 text-center">
          {isCompleted ? (
            <>
              <CheckCircle className="w-6 h-6 text-emerald-300 animate-bounce shrink-0" />
              {completedText}
            </>
          ) : (
            <>
              {variant === 'detonate' && <Flame className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />}
              {text}
              <ChevronRight className="w-5 h-5 text-white/70 animate-pulse shrink-0" />
            </>
          )}
        </span>

        {/* Sliding Thumb Handle */}
        {!isCompleted && (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 240 }}
            dragElastic={0.1}
            dragSnapToOrigin={!isCompleted}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="absolute left-1.5 top-1.5 bottom-1.5 w-14 bg-white rounded-lg shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing border border-slate-200 z-10 hover:bg-slate-50 transition-colors"
          >
            {variant === 'detonate' ? (
              <Flame className="w-7 h-7 text-blue-600" />
            ) : variant === 'deliver' ? (
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-red-600" />
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
