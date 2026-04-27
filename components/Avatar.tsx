'use client';

import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

export function Avatar({
  src,
  alt,
  className = "",
  imageClassName = "",
  fallbackClassName = ""
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initial = alt.charAt(0);
  const shouldShowImage = Boolean(src) && !imageFailed;

  return (
    <div className={`flex-shrink-0 overflow-hidden ${className}`}>
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${imageClassName}`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-black ${fallbackClassName}`}>
          {initial}
        </div>
      )}
    </div>
  );
}
