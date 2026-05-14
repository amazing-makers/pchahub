'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Info,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@amakers/ui'
import type { MockBrand } from '@/lib/mock-data'

interface MenuEntry {
  /** Existing menu image URL OR data URI from a fresh upload. */
  url: string
  name: string
  signature: boolean
}

interface FormState {
  description: string
  logo: string                 // current logo (data URI or upload)
  storeImages: string[]        // 2 store photos
  menuImages: MenuEntry[]      // up to 6 menu photos
  promoVideoUrl: string
}

interface Props {
  brand: MockBrand
}

export function BrandEditForm({ brand }: Props) {
  const [state, setState] = useState<FormState>({
    description: brand.description,
    logo: brand.logo,
    storeImages: brand.storeImages.slice(0, 2),
    menuImages: brand.menuImages.slice(0, 6).map((m) => ({
      url: m.url,
      name: m.name,
      signature: Boolean(m.signature),
    })),
    promoVideoUrl: brand.videoUrl ?? '',
  })
  const [saved, setSaved] = useState(false)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((p) => ({ ...p, [key]: value }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save — real implementation would POST to /api/hq/brand/update which
    // writes to Supabase. The toast simulates the round-trip.
    setSaved(true)
    setTimeout(() => setSaved(false), 4000)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const videoValid = state.promoVideoUrl ? isEmbeddable(state.promoVideoUrl) : null

  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <a
            href="/hq/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            대시보드로
          </a>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ background: brand.logoColor }}
                aria-hidden
              />
              <div>
                <h1 className="text-h3 font-bold text-gray-900">
                  브랜드 정보 수정
                </h1>
                <div className="mt-0.5 text-sm text-gray-500">
                  {brand.name} · {brand.categoryLabel}
                </div>
              </div>
            </div>
            <a href={`/brands/${brand.id}`}>
              <Button size="md" variant="outline">
                공개 페이지에서 미리보기
              </Button>
            </a>
          </div>
        </div>
      </section>

      <form onSubmit={handleSave} className="container mx-auto grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {saved && (
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="flex items-center gap-2 p-4 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="text-emerald-900">
                  변경사항이 저장되었습니다. 공개 페이지에 반영되는 데 최대 5분이
                  소요될 수 있습니다.
                </span>
              </CardContent>
            </Card>
          )}

          {/* 브랜드 소개 */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-3 p-6">
              <SectionHeader
                title="브랜드 한 줄 소개"
                helper="브랜드 카드와 검색 결과에 노출되는 문구입니다."
              />
              <input
                type="text"
                value={state.description}
                onChange={(e) => update('description', e.target.value)}
                className="form-input"
                maxLength={80}
              />
              <p className="text-xs text-gray-400">
                {state.description.length}/80자
              </p>
            </CardContent>
          </Card>

          {/* 로고 */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <SectionHeader
                title="브랜드 로고"
                helper="투명 배경 PNG 또는 SVG. 권장 512×512 이상."
              />
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state.logo}
                    alt={`${brand.name} 로고`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <LocalImagePicker
                    label="로고 교체"
                    onChange={(dataUri) => update('logo', dataUri)}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    PNG · SVG · JPG. 최대 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 매장 사진 */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <SectionHeader
                title="매장 사진"
                helper="외관 1장 + 내부 1장 권장. 예비 점주가 가장 먼저 확인하는 시각 자료입니다."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {[0, 1].map((i) => (
                  <PhotoSlot
                    key={i}
                    label={i === 0 ? '매장 외관' : '매장 내부'}
                    value={state.storeImages[i]}
                    onChange={(url) => {
                      const next = [...state.storeImages]
                      next[i] = url
                      update('storeImages', next.filter((u): u is string => Boolean(u)))
                    }}
                    onRemove={() => {
                      const next = [...state.storeImages]
                      next.splice(i, 1)
                      update('storeImages', next)
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 메뉴 사진 */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <SectionHeader
                title="메뉴 사진"
                helper="시그니처 메뉴 1개 + 대표 메뉴 3개를 권장합니다. 사진 + 메뉴명을 함께 등록하세요."
              />
              <div className="space-y-3">
                {state.menuImages.map((m, idx) => (
                  <div
                    key={idx}
                    className="grid gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:grid-cols-[88px_1fr_auto]"
                  >
                    <PhotoSlot
                      compact
                      value={m.url}
                      onChange={(url) => {
                        setState((p) => ({
                          ...p,
                          menuImages: p.menuImages.map((it, i) =>
                            i === idx ? { ...it, url } : it,
                          ),
                        }))
                      }}
                      onRemove={() => {
                        setState((p) => ({
                          ...p,
                          menuImages: p.menuImages.map((it, i) =>
                            i === idx ? { ...it, url: '' } : it,
                          ),
                        }))
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) =>
                          setState((p) => ({
                            ...p,
                            menuImages: p.menuImages.map((it, i) =>
                              i === idx ? { ...it, name: e.target.value } : it,
                            ),
                          }))
                        }
                        placeholder="메뉴명"
                        className="form-input"
                      />
                      <label className="inline-flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={m.signature}
                          onChange={(e) => {
                            const checked = e.target.checked
                            // 시그니처는 하나만. 체크 시 다른 메뉴의 signature를 모두 해제.
                            setState((p) => ({
                              ...p,
                              menuImages: p.menuImages.map((it, i) => ({
                                ...it,
                                signature: i === idx ? checked : checked ? false : it.signature,
                              })),
                            }))
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        시그니처 메뉴 (1개)
                      </label>
                    </div>
                    <button
                      type="button"
                      aria-label="메뉴 삭제"
                      onClick={() =>
                        setState((p) => ({
                          ...p,
                          menuImages: p.menuImages.filter((_, i) => i !== idx),
                        }))
                      }
                      className="self-start text-rose-500 hover:bg-rose-50 rounded-md p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {state.menuImages.length < 6 && (
                  <button
                    type="button"
                    onClick={() =>
                      setState((p) => ({
                        ...p,
                        menuImages: [
                          ...p.menuImages,
                          { url: '', name: '', signature: false },
                        ],
                      }))
                    }
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <Plus className="h-4 w-4" />
                    메뉴 추가
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 홍보 영상 */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-3 p-6">
              <SectionHeader
                title="홍보 영상"
                helper="YouTube 또는 Vimeo 영상 URL. 매장 분위기·메뉴·인터뷰 영상을 권장합니다."
              />
              <div className="relative">
                <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={state.promoVideoUrl}
                  onChange={(e) => update('promoVideoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... 또는 https://vimeo.com/..."
                  className="form-input pl-9"
                />
              </div>
              {state.promoVideoUrl && (
                <p
                  className={
                    'text-xs ' +
                    (videoValid ? 'text-emerald-700' : 'text-amber-700')
                  }
                >
                  {videoValid
                    ? '✓ 인식된 영상입니다. 공개 페이지에 임베드되어 표시됩니다.'
                    : '⚠ YouTube(youtu.be / youtube.com) 또는 Vimeo 링크만 임베드 가능합니다.'}
                </p>
              )}
              {videoValid && (
                <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                  <iframe
                    src={embeddableUrl(state.promoVideoUrl)!}
                    title="영상 미리보기"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 안내 */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-start gap-3 p-5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="text-sm">
                <div className="font-semibold text-amber-900">
                  편집 가능한 항목 안내
                </div>
                <p className="mt-1 text-amber-800">
                  매장수·창업비·로열티·평균 매출 등은 공정거래위원회 정보공개서와
                  자동 연동되어 본사가 직접 수정할 수 없습니다. 사진·영상·소개 문구만
                  본사 재량으로 편집 가능합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sticky summary + save */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div>
                <div className="text-xs text-gray-500">수정 요약</div>
                <div className="mt-2 space-y-1.5 text-sm">
                  <Row
                    label="매장 사진"
                    value={`${state.storeImages.filter(Boolean).length}/2장`}
                  />
                  <Row
                    label="메뉴 사진"
                    value={`${state.menuImages.filter((m) => m.url).length}개`}
                  />
                  <Row
                    label="시그니처"
                    value={
                      state.menuImages.find((m) => m.signature)
                        ? `${state.menuImages.find((m) => m.signature)?.name || '미정'}`
                        : '미지정'
                    }
                  />
                  <Row
                    label="영상"
                    value={
                      state.promoVideoUrl
                        ? videoValid
                          ? '등록 완료'
                          : '형식 확인 필요'
                        : '미등록'
                    }
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-1">
                <Save className="h-4 w-4" />
                변경사항 저장
              </Button>

              <p className="text-xs text-gray-500">
                저장 후 공개 페이지에 반영되기까지 최대 5분이 소요될 수 있습니다.
                정보공개서 항목은 별도 검수가 필요합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        <style jsx>{`
          :global(.form-input) {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
            background: white;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }
          :global(.form-input:focus) {
            outline: none;
            box-shadow: 0 0 0 2px var(--brand-primary);
          }
        `}</style>
      </form>
    </main>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

function SectionHeader({ title, helper }: { title: string; helper?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {helper && <p className="mt-0.5 text-xs text-gray-500">{helper}</p>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-1.5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="max-w-[60%] text-right text-xs font-medium text-gray-900">
        {value}
      </span>
    </div>
  )
}

/**
 * Photo slot with live preview. Reads a local file as a data URI so the
 * preview updates without a network round-trip. In production this would
 * trigger a real upload to Supabase Storage and update the URL state with
 * the persistent CDN URL.
 */
function PhotoSlot({
  label,
  value,
  onChange,
  onRemove,
  compact,
}: {
  label?: string
  value: string | undefined
  onChange: (dataUri: string) => void
  onRemove: () => void
  compact?: boolean
}) {
  const id = `photo-${Math.random().toString(36).slice(2, 8)}`
  const hasImage = Boolean(value)

  return (
    <div>
      {label && (
        <div className="mb-1.5 text-xs font-medium text-gray-700">{label}</div>
      )}
      <label
        htmlFor={id}
        className={
          'group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ' +
          (compact ? 'aspect-square h-22 w-22' : 'aspect-video') +
          ' ' +
          (hasImage
            ? 'border-transparent bg-gray-100'
            : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300')
        }
      >
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label ?? '사진'}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-medium text-white">교체</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 p-3 text-center">
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs">사진 추가</span>
          </div>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => {
              if (typeof reader.result === 'string') onChange(reader.result)
            }
            reader.readAsDataURL(file)
            e.target.value = ''
          }}
        />
      </label>
      {hasImage && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-1.5 inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700"
        >
          <Trash2 className="h-3 w-3" />
          제거
        </button>
      )}
    </div>
  )
}

/** Simpler picker used in the logo card (full label, no preview built in). */
function LocalImagePicker({
  label,
  onChange,
}: {
  label: string
  onChange: (dataUri: string) => void
}) {
  const id = `pick-${Math.random().toString(36).slice(2, 8)}`
  return (
    <>
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
      >
        <Upload className="h-4 w-4" />
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === 'string') onChange(reader.result)
          }
          reader.readAsDataURL(file)
          e.target.value = ''
        }}
      />
    </>
  )
}

// ── URL helpers (mirror brand detail page) ─────────────────────────────────

function embeddableUrl(raw: string): string | null {
  try {
    const u = new URL(raw)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      if (u.pathname.startsWith('/embed/')) return raw
      return null
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    if (host === 'player.vimeo.com') return raw
    return null
  } catch {
    return null
  }
}

function isEmbeddable(raw: string): boolean {
  return embeddableUrl(raw) !== null
}
