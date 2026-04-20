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
  imageClassName = "grayscale contrast-125",
  fallbackClassName = ""
}: AvatarProps) {
  const initial = alt.charAt(0);

  return (
    <div className={`flex-shrink-0 overflow-hidden ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${imageClassName}`}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-black ${fallbackClassName}`}>
          {initial}
        </div>
      )}
    </div>
  );
}
