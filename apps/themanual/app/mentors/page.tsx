import { MentorCard } from '@/components/mentor-card'
import { MENTORS } from '@/lib/mock-data'

export default function MentorsPage() {
  return (
    <main className="bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-8">
          <h1 className="text-h3 font-bold text-gray-900">멘토</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            현직 점주·세무·법률·디자이너 전문가가 1:1로 상담해 드립니다. 강의로 풀리지 않는
            구체적인 고민에 답을 받으세요.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENTORS.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>
      </div>
    </main>
  )
}
