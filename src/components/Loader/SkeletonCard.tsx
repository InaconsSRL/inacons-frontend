import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      {/* Imagen skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
      
      {/* Título skeleton */}
      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
      
      {/* Descripción skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
      
      {/* Botón skeleton */}
      <div className="mt-4 h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
};