import { MessageCircle, Star } from 'lucide-react'
import { Badge, Card, CardContent } from '@amakers/ui'
import { formatNumber } from '@amakers/utils'
import type { MockMentor } from '@/lib/mock-data'

interface MentorCardProps {
  mentor: MockMentor
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <a href={`/mentors/${mentor.id}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mentor.avatarUrl}
                alt={mentor.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-gray-900">{mentor.name}</h3>
                {mentor.featured && <Badge variant="primary">추천</Badge>}
              </div>
              <p className="mt-0.5 text-sm text-gray-600">{mentor.role}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {mentor.rating}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {formatNumber(mentor.totalConsultations)}회 상담
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-gray-600">{mentor.bio}</p>

          <div className="mt-3 flex flex-wrap gap-1">
            {mentor.specialties.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500">시간당 상담료</div>
            <div className="text-sm font-bold text-gray-900">
              {formatNumber(mentor.hourlyRate)}원
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
