import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'
import { Award, ArrowLeft } from 'lucide-react'
import { AWARDS, brandById, storeById, RANK_LABEL, RANK_COLOR } from '@/lib/mock-data'
import { CertificatePrintButton } from './print-button'

interface Props {
  params: { awardId: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const award = AWARDS.find((a) => a.id === params.awardId)
  if (!award) return {}
  const brand = brandById(award.brandId)
  return buildPageMetadata('bestplace', {
    title: `${award.year} ${award.categoryLabel} ${RANK_LABEL[award.rank]} 상장 — ${brand?.name}`,
    description: `베스트플레이스 ${award.year}년 ${award.categoryLabel} 카테고리 ${RANK_LABEL[award.rank]} 수상 공식 상장`,
    path: `/certificate/${award.id}`,
  })
}

const RANK_TITLE: Record<number, string> = {
  1: '대 상',
  2: '금 상',
  3: '은 상',
}

export default function CertificatePage({ params }: Props) {
  const award = AWARDS.find((a) => a.id === params.awardId)
  if (!award) notFound()

  const brand = brandById(award.brandId)
  const store = award.representativeStoreId ? storeById(award.representativeStoreId) : null
  const rankColor = RANK_COLOR[award.rank]

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Screen-only nav */}
      <div className="print:hidden border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center justify-between py-4">
          <a
            href={`/awards/${award.year}`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" /> {award.year} 어워드로 돌아가기
          </a>
          <CertificatePrintButton />
        </div>
      </div>

      {/* Certificate */}
      <div className="container mx-auto py-10 print:p-0">
        <div
          id="certificate"
          className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl print:max-w-none print:rounded-none print:shadow-none"
          style={{ border: `3px solid ${rankColor}` }}
        >
          {/* Top color band */}
          <div
            className="px-10 py-6 text-center"
            style={{ background: `linear-gradient(135deg, ${rankColor}22, ${rankColor}08)` }}
          >
            {/* Logo area */}
            <div className="flex items-center justify-center gap-2">
              <Award className="h-6 w-6" style={{ color: rankColor }} />
              <span className="text-sm font-bold tracking-widest text-gray-600">BESTPLACE</span>
              <Award className="h-6 w-6" style={{ color: rankColor }} />
            </div>
            <p className="mt-1 text-xs tracking-widest text-gray-400">베스트플레이스 공식 어워드</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 px-10">
            <div className="h-px flex-1" style={{ background: rankColor }} />
            <div className="h-2 w-2 rounded-full" style={{ background: rankColor }} />
            <div className="h-px flex-1" style={{ background: rankColor }} />
          </div>

          {/* Main content */}
          <div className="px-10 py-10 text-center">
            {/* Rank badge */}
            <div
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
              style={{ background: `${rankColor}18`, border: `3px solid ${rankColor}` }}
            >
              <span className="text-2xl font-black" style={{ color: rankColor }}>
                {RANK_TITLE[award.rank]}
              </span>
            </div>

            {/* Brand */}
            <div className="text-3xl font-black tracking-tight text-gray-900">
              {brand?.name ?? '—'}
            </div>

            {/* Store name if available */}
            {store && (
              <div className="mt-1 text-base text-gray-500">{store.name}</div>
            )}

            {/* Award title */}
            <div
              className="mx-auto mt-6 inline-block rounded-full px-6 py-2 text-base font-bold text-white"
              style={{ background: rankColor }}
            >
              {award.year}년 {award.categoryLabel} {RANK_LABEL[award.rank]}
            </div>

            {/* Citation */}
            <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-gray-600">
              {award.citation}
            </p>

            {/* Body text */}
            <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-gray-50 px-8 py-6">
              <p className="text-sm leading-loose text-gray-700">
                위 업체는 {award.year}년 {award.categoryLabel} 부문에서
                <br />
                탁월한 운영 성과와 고객 만족도를 달성하여
                <br />
                베스트플레이스 어워드 <strong>{RANK_LABEL[award.rank]}</strong>을 수상하였기에
                <br />
                이 상장을 드립니다.
              </p>
            </div>

            {/* Date */}
            <div className="mt-8 text-sm text-gray-500">
              {award.year}년 12월 31일
            </div>

            {/* Issuer */}
            <div className="mt-4">
              <div className="text-base font-bold text-gray-900">베스트플레이스</div>
              <div className="text-xs text-gray-400">amakers Co., Ltd.</div>
            </div>

            {/* Seal */}
            <div
              className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                border: `2px solid ${rankColor}`,
                background: `${rankColor}10`,
              }}
            >
              <span className="text-[10px] font-bold leading-tight text-center" style={{ color: rankColor }}>
                공식<br />인증
              </span>
            </div>
          </div>

          {/* Bottom color band */}
          <div
            className="px-10 py-4 text-center"
            style={{ background: `${rankColor}10` }}
          >
            <p className="text-xs text-gray-400">
              bestplace.amakers.co.kr · 이 상장은 베스트플레이스가 공식 발급합니다.
            </p>
          </div>
        </div>

        {/* Screen-only actions */}
        <div className="print:hidden mt-6 flex justify-center gap-3">
          <a
            href={`/awards/${award.year}`}
            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" /> 어워드 목록
          </a>
          {store && (
            <a
              href={`/stores/${store.id}`}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              매장 상세 보기
            </a>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; }
          #certificate { border-radius: 0 !important; }
        }
      `}</style>
    </main>
  )
}
