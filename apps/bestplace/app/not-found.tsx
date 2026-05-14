'use client'

import { ArrowLeft, Award, Home, Store } from 'lucide-react'
import { Button } from '@amakers/ui'

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg text-center">
        <div
          className="text-[120px] font-black leading-none tracking-tighter"
          style={{ color: 'var(--brand-primary)', opacity: 0.15 }}
          aria-hidden
        >
          404
        </div>

        <div className="-mt-4">
          <h1 className="text-h2 font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
          <p className="mt-3 text-base text-gray-500">
            주소가 잘못되었거나 삭제된 페이지입니다.
            <br />
            아래 링크에서 매장과 어워드를 둘러보세요.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <a href="/">
            <Button size="lg" className="gap-1.5">
              <Home className="h-4 w-4" />
              홈으로
            </Button>
          </a>
          <a href="/stores">
            <Button size="lg" variant="outline" className="gap-1.5">
              <Store className="h-4 w-4" />
              매장 디렉토리
            </Button>
          </a>
          <a href="/awards">
            <Button size="lg" variant="outline" className="gap-1.5">
              <Award className="h-4 w-4" />
              어워드
            </Button>
          </a>
        </div>

        <button
          type="button"
          onClick={() => history.back()}
          className="mt-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          이전 페이지로 돌아가기
        </button>
      </div>
    </main>
  )
}
