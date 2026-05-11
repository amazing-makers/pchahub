import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@amakers/ui'
import type { MockService } from '@/lib/mock-data'

interface ServiceCardProps {
  service: MockService
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <a href={`/services/${service.slug}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-6">
          <div
            className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-white"
            style={{ background: service.accentColor }}
          >
            {service.title}
          </div>
          <p className="mt-3 text-base font-semibold text-gray-900">{service.subtitle}</p>
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">{service.description}</p>

          <ul className="mt-4 space-y-1.5">
            {service.includes.slice(0, 4).map((inc) => (
              <li key={inc} className="flex items-start gap-2 text-xs text-gray-700">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {inc}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500">
              <div>{service.priceLabel}</div>
              <div className="mt-0.5 text-gray-400">{service.duration}</div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm text-gray-700 group-hover:text-gray-900">
              자세히 <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
