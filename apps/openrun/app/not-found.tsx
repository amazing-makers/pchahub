export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-bold" style={{ color: '#F97316' }}>404</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-sm text-gray-500">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <a
        href="/"
        className="mt-6 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ background: '#F97316' }}
      >
        홈으로 돌아가기
      </a>
    </main>
  )
}
