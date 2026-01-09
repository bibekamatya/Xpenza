const TransactionsSkeleton = () => {
  return (
    <div className="divide-y divide-slate-700">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-5 w-16 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsSkeleton;
