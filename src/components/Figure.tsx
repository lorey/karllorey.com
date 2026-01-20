import { useRef } from "react";

interface FigureProps {
  src: string;
  alt?: string;
}

export function Figure({ src, alt }: FigureProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openLightbox = () => {
    dialogRef.current?.showModal();
  };

  const closeLightbox = () => {
    dialogRef.current?.close();
  };

  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt || ""}
        onClick={openLightbox}
        className="border border-gray-200 hover:border-gray-300 transition-colors cursor-zoom-in"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-gray-700">
          {alt}
        </figcaption>
      )}

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
        className="fixed inset-0 m-0 h-screen w-screen max-h-none max-w-none bg-black/90 p-4 backdrop:bg-transparent"
      >
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={src}
            alt={alt || ""}
            onClick={closeLightbox}
            className="max-h-full max-w-full cursor-zoom-out object-contain"
          />
        </div>
      </dialog>
    </figure>
  );
}
