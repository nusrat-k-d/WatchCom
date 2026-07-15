export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] pb-24 text-left">
      
      {/* 1. Hero Backdrop Skeleton */}
      <div className="relative h-[75vh] md:h-[80vh] bg-zinc-950/40 border-b border-zinc-900 flex items-end pb-12 overflow-hidden">
        {/* Shimmer pulse effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-20 flex flex-col lg:flex-row gap-12 items-center lg:items-end">
          
          {/* Floating Poster Skeleton */}
          <div className="w-48 sm:w-60 md:w-72 h-72 sm:h-90 md:h-[400px] bg-zinc-900/60 rounded-3xl animate-pulse border border-zinc-800 shrink-0" />
          
          {/* Metadata Text Shimmers */}
          <div className="flex-1 w-full space-y-6">
            <div className="h-6 bg-zinc-900/80 rounded w-1/4 animate-pulse" />
            <div className="h-16 bg-zinc-900/80 rounded w-3/4 animate-pulse" />
            <div className="h-8 bg-zinc-900/80 rounded w-1/2 animate-pulse" />
            <div className="flex gap-4">
              <div className="h-12 bg-zinc-900/80 rounded-xl w-32 animate-pulse" />
              <div className="h-12 bg-zinc-900/80 rounded-xl w-40 animate-pulse" />
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Content Grid Skeleton */}
      <div className="container mx-auto px-4 md:px-8 mt-16 space-y-16">
        
        {/* AI Summary Shimmer */}
        <div className="bg-zinc-950/40 border border-zinc-900 p-8 rounded-[2rem] space-y-4 animate-pulse">
          <div className="h-4 bg-zinc-900 rounded w-1/6" />
          <div className="h-10 bg-zinc-900 rounded w-full" />
          <div className="h-10 bg-zinc-900 rounded w-5/6" />
        </div>

        {/* Why Recommended Shimmer */}
        <div className="bg-zinc-950/40 border border-zinc-900 p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 animate-pulse">
          <div className="h-12 w-12 bg-zinc-900 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-zinc-900 rounded w-1/5" />
            <div className="h-6 bg-zinc-900 rounded w-3/4" />
          </div>
        </div>

      </div>
    </div>
  )
}
