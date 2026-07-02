import Image from "next/image";

/**
 * Full-body / portrait photo frame. Drops the real photo in when `src` exists,
 * otherwise shows the design placeholder so layout stays intact pre-asset.
 */
export default function PhotoSlot({
  src,
  alt,
  placeholder = "Drop your photo",
  className = "",
}: {
  src?: string;
  alt?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-line bg-[rgba(12,16,22,0.5)] ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt ?? "portrait"} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-[11px] text-faint">
          {placeholder}
        </div>
      )}
    </div>
  );
}
