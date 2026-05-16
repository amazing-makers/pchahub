'use client'

import { useState } from 'react'
import { ImageLightbox, LightboxTrigger } from '@/components/image-lightbox'

interface ListingImageGalleryProps {
  images: string[]
  title: string
}

export function ListingImageGallery({ images, title }: ListingImageGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState(-1)

  if (images.length === 0) return null

  return (
    <>
      {/* ── Main grid ── */}
      <div className="grid h-80 grid-cols-3 gap-1">
        {/* Hero image */}
        <button
          type="button"
          onClick={() => setLightboxIdx(0)}
          className="group relative col-span-3 overflow-hidden sm:col-span-2 sm:row-span-2"
          aria-label="사진 확대 보기"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <LightboxTrigger />
        </button>

        {/* Side thumbnails */}
        {images.slice(1, 3).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIdx(i + 1)}
            className="group relative overflow-hidden"
            aria-label={`${i + 2}번 사진 확대 보기`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} ${i + 2}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <LightboxTrigger />
            {/* "More" overlay on last visible thumb when there are additional images */}
            {i === 1 && images.length > 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <span className="text-lg font-bold text-white">+{images.length - 3}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ── Bottom thumbnail strip (when > 3 images) ── */}
      {images.length > 3 && (
        <div className="grid grid-cols-4 gap-1 border-t border-gray-100 p-1">
          {images.map((src, i) => {
            // When lightbox is open show its current index; otherwise show hero (0)
            const activeIdx = lightboxIdx >= 0 ? lightboxIdx : 0
            const isActive = i === activeIdx
            return (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIdx(i)}
                className={`group relative aspect-[16/10] overflow-hidden rounded-md transition-all ${
                  isActive
                    ? 'ring-2 ring-gray-900 ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={`${i + 1}번 사진`}
                aria-pressed={isActive}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`thumb ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            )
          })}
        </div>
      )}

      {/* ── Lightbox ── */}
      <ImageLightbox
        images={images}
        current={lightboxIdx}
        onClose={() => setLightboxIdx(-1)}
        onNavigate={setLightboxIdx}
        alt={title}
      />
    </>
  )
}
