import React from 'react';

export const ProviderCardSkeleton = () => {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft animate-pulse"
      aria-hidden="true"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Photo Skeleton */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-200 flex-shrink-0" />

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-28 h-5 rounded-full bg-slate-200" />
            <div className="w-20 h-4 rounded bg-slate-200" />
          </div>

          <div className="w-48 h-6 rounded bg-slate-200" />
          <div className="w-72 h-3.5 rounded bg-slate-100" />

          {/* Details row */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="w-32 h-3 rounded bg-slate-100" />
            <div className="w-36 h-3 rounded bg-slate-100" />
            <div className="w-28 h-3 rounded bg-slate-100" />
            <div className="w-30 h-3 rounded bg-slate-100" />
          </div>

          {/* Fee & slots row */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="w-32 h-4 rounded bg-slate-200" />
            <div className="flex gap-2">
              <div className="w-24 h-9 rounded-xl bg-slate-200" />
              <div className="w-28 h-9 rounded-xl bg-teal-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FiltersSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft animate-pulse space-y-5" aria-hidden="true">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="w-24 h-5 rounded bg-slate-200" />
        <div className="w-16 h-4 rounded bg-slate-100" />
      </div>

      <div className="space-y-2">
        <div className="w-20 h-3.5 rounded bg-slate-200" />
        <div className="w-full h-10 rounded-xl bg-slate-100" />
      </div>

      <div className="space-y-2">
        <div className="w-24 h-3.5 rounded bg-slate-200" />
        <div className="w-full h-10 rounded-xl bg-slate-100" />
      </div>

      <div className="space-y-2">
        <div className="w-28 h-3.5 rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-xl bg-slate-100" />
          <div className="h-9 rounded-xl bg-slate-100" />
          <div className="h-9 rounded-xl bg-slate-100" />
          <div className="h-9 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

export const ProviderDetailsSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-6" aria-hidden="true">
      {/* Header Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row gap-6">
        <div className="w-32 h-32 rounded-3xl bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="w-32 h-6 rounded-full bg-teal-100" />
          <div className="w-64 h-8 rounded bg-slate-200" />
          <div className="w-80 h-4 rounded bg-slate-100" />
          <div className="flex gap-4 pt-2">
            <div className="w-28 h-4 rounded bg-slate-100" />
            <div className="w-36 h-4 rounded bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Tabs and Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-12 bg-white rounded-2xl border border-slate-200" />
          <div className="h-64 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <div className="w-40 h-5 rounded bg-slate-200" />
            <div className="w-full h-3 rounded bg-slate-100" />
            <div className="w-full h-3 rounded bg-slate-100" />
            <div className="w-3/4 h-3 rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-96 bg-white rounded-2xl border border-slate-200" />
      </div>
    </div>
  );
};
