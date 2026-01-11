"use client";

import { useState, useRef } from "react";
import { Edit2, Trash2, TrendingUp, TrendingDown, Check } from "lucide-react";
import { Transaction } from "@/lib/types";
import { getIcon, formatDateWithBS } from "@/lib/helper";

interface SwipeableTransactionProps {
  item: Transaction;
  bulkMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SwipeableTransaction({
  item,
  bulkMode,
  isSelected,
  onSelect,
  onClick,
  onEdit,
  onDelete,
}: SwipeableTransactionProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (bulkMode) return;
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (bulkMode) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    if (Math.abs(diff) > 5) setIsDragging(true);
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (bulkMode) return;
    const diff = currentX.current - startX.current;
    const threshold = 80;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        onEdit();
      } else {
        onDelete();
      }
    }
    
    setTranslateX(0);
    startX.current = 0;
    currentX.current = 0;
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleClick = () => {
    if (isDragging) return;
    if (bulkMode) {
      onSelect();
    } else {
      onClick();
    }
  };

  const opacity = Math.min(Math.abs(translateX) / 80, 1);

  return (
    <div className="relative overflow-hidden group" style={{ touchAction: 'pan-y' }}>
      {/* Background actions */}
      <div
        className="absolute inset-0 flex items-center justify-between px-6 bg-blue-600"
        style={{ opacity: translateX > 0 ? opacity : 0 }}
      >
        <div className="flex items-center gap-2 text-white">
          <Edit2 className="w-5 h-5" />
          <span className="font-medium">Edit</span>
        </div>
      </div>
      
      <div
        className="absolute inset-0 flex items-center justify-between px-6 bg-red-600"
        style={{ opacity: translateX < 0 ? opacity : 0 }}
      >
        <div className="ml-auto flex items-center gap-2 text-white">
          <span className="font-medium">Delete</span>
          <Trash2 className="w-5 h-5" />
        </div>
      </div>

      {/* Transaction card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          touchAction: 'none'
        }}
        className={`p-4 bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer border-b border-slate-700 ${
          bulkMode && isSelected ? "bg-blue-600/10 border-l-4 border-blue-600" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {bulkMode && (
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected ? "bg-blue-600 border-blue-600" : "border-slate-600"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
          )}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
              <span className="text-xl">{getIcon(item.category)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {item.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDateWithBS(item.date)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              {item.type === "income" ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <p
                className={`text-base font-bold ${
                  item.type === "income" ? "text-green-500" : "text-red-500"
                }`}
              >
                Rs. {item.amount}
              </p>
            </div>
            <div className="hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 hover:bg-blue-600/20 rounded-lg transition-all active:scale-90"
              >
                <Edit2 className="w-4 h-4 text-blue-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 hover:bg-red-600/20 rounded-lg transition-all active:scale-90"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
