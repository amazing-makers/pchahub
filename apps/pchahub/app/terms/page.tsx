import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '이용약관',
  description:
    '9개 사이트 통합 플랫폼(프차허브·오픈런·공간의한수·더명당·더메뉴얼·장사노트·베스트플레이스·창업다큐·프차브릿지) 이용약관',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-12">
          <h1 className="text-h2 font-bold text-gray-900">이용약관</h1>
          <p className="mt-2 text-sm text-gray-500">
            최종 개정일: 2026-05-01 · 9개 사이트 통합 플랫폼 9개 사이트 공통 약관
          </p>
        </div>
      </section>

      <article className="container mx-auto max-w-3xl py-12">
        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <Section title="제1조 (목적)">
            본 약관은 회사(이하 &ldquo;회사&rdquo;)가 운영하는 프차허브·오픈런·공간의한수·더명당·더메뉴얼·장사노트·베스트플레이스·창업다큐·프차브릿지(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여
            회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
          </Section>

          <Section title="제2조 (정의)">
            <ul className="ml-4 list-disc space-y-1">
              <li><b>&ldquo;서비스&rdquo;</b>란 회사가 제공하는 9개 사이트와 부가 서비스를 의미합니다.</li>
              <li><b>&ldquo;이용자&rdquo;</b>란 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 의미합니다.</li>
              <li><b>&ldquo;본사&rdquo;</b>란 프랜차이즈 가맹사업을 운영하는 사업자를 의미합니다.</li>
              <li><b>&ldquo;가맹점주&rdquo;</b>란 본사와 가맹계약을 체결하여 매장을 운영하는 자를 의미합니다.</li>
            </ul>
          </Section>

          <Section title="제3조 (약관의 효력 및 변경)">
            본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다. 회사는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수
            있으며, 변경된 약관은 적용일자 7일 전부터 공지합니다. 이용자에게 불리한 변경의 경우 30일 전 공지합니다.
          </Section>

          <Section title="제4조 (서비스의 제공)">
            회사는 다음과 같은 서비스를 제공합니다. 일부 서비스는 본사·점주·투자자별로 자격이 다를 수 있습니다.
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>프랜차이즈 본사 정보·매물·교육·커뮤니티 콘텐츠 제공</li>
              <li>본사-점주, 본사-투자자, 매장-시공사 매칭</li>
              <li>표준 계약서·에스크로·실사 등 안전 거래 부가 서비스</li>
            </ul>
          </Section>

          <Section title="제5조 (정보 공개의 기준)">
            회사는 한국 프랜차이즈 협회 등록 정보공개서·공정거래위원회 공시 자료 등 공신력 있는 1차 자료를 기준으로 정보를
            제공합니다. 본사가 직접 입력한 자료는 별도 표기하며, 회사는 사실관계 확인에 합리적인 노력을 다합니다.
          </Section>

          <Section title="제6조 (이용자의 의무)">
            이용자는 다음 행위를 해서는 안 됩니다.
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>타인의 정보 도용 또는 허위 정보 등록</li>
              <li>서비스 운영을 방해하거나 비정상적으로 자동화된 접근</li>
              <li>매물·라운드·매장 등록 시 허위·과장 정보 게시</li>
              <li>다른 이용자에 대한 명예훼손·욕설·차별적 발언</li>
            </ul>
          </Section>

          <Section title="제7조 (회사의 면책)">
            회사는 본사·점주·투자자 등 이용자 간 직접 거래에서 발생한 분쟁에 대해 원칙적으로 책임을 지지 않습니다. 다만
            안전 거래(에스크로·표준 계약서)를 통한 거래의 경우 회사가 정한 절차에 따라 분쟁 조정에 협력합니다.
          </Section>

          <Section title="제8조 (분쟁 해결)">
            본 약관에 관한 분쟁은 대한민국 법령을 적용하며, 회사 본점 소재지 관할 법원을 1심 관할 법원으로 합니다.
          </Section>

          <p className="border-t border-gray-100 pt-6 text-xs text-gray-500">
            본 페이지는 9개 사이트 공통 약관입니다. 사이트별 부가 정책이 있는 경우 해당 사이트 안내를 함께 참고해 주세요.
          </p>
        </div>
      </article>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-h5 font-semibold text-gray-900">{title}</h2>
      <div className="mt-3 text-gray-700">{children}</div>
    </section>
  )
}
