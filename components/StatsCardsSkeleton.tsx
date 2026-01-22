const StatsCardsSkeleton = () => {
  return (
    <div className="px-4 md:px-8 pb-4 md:pb-6">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-3 border border-slate-700 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-16 mb-2"></div>
            <div className="h-6 bg-slate-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCardsSkeleton;