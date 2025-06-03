import React from "react";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div 
      className={`bg-gray-200 rounded-md animate-pulse ${className}`} 
      {...props}
    />
  );
};