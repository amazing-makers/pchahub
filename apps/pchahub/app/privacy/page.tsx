import type { Metadata } from 'next'
import { buildPageMetadata } from '@amakers/design-system'

export const metadata: Metadata = buildPageMetadata('pchahub', {
  title: '개인정보처리방침',
  description:
    '9개 사이트 통합 플랫폼(프차허브·오픈런·공간의한수·더명당·더메뉴얼·장사노트·베스트플레이스·창업다큐·프차브릿지) 개인정보처리방침',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto py-12">
          <h1 className="text-h2 font-bold text-gray-900">개인정보처리방침</h1>
          <p className="mt-2 text-sm text-gray-500">
            최종 개정일: 2026-05-01 · 9개 사이트 통합 플랫폼 9개 사이트 공통 방침
          </p>
        </div>
      </section>

      <article className="container mx-auto max-w-3xl py-12">
        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <Section title="1. 수집하는 개인정보 항목">
            <p>회사는 다음 항목을 수집합니다.</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li><b>필수</b>: 이메일, 이름(또는 닉네임), 비밀번호(해시), 역할(본사·점주·일반)</li>
              <li><b>선택</b>: 연락처, 회사명/브랜드명, 관심 카테고리, 지역</li>
              <li><b>자동 수집</b>: 접속 로그, IP, 쿠키, 기기·브라우저 정보</li>
              <li><b>본사 등록 시</b>: 사업자등록번호, 법인명, 정보공개서 등록번호</li>
            </ul>
          </Section>

          <Section title="2. 수집 및 이용 목적">
            <ul className="ml-4 list-disc space-y-1">
              <li>회원 식별·인증(통합 계정 SSO 포함) 및 서비스 제공</li>
              <li>본사·점주·투자자 매칭 및 견적·상담 안내</li>
              <li>안전 거래(에스크로·표준 계약·실사) 진행 시 분쟁 대응</li>
              <li>법령 준수 및 부정 이용 방지</li>
            </ul>
          </Section>

          <Section title="3. 보유 및 이용 기간">
            <p>회원 탈퇴 시 즉시 파기하며, 다음의 경우 관련 법령에 따라 보관합니다.</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>전자상거래법: 계약·청약철회·대금결제·재화공급 기록 5년</li>
              <li>전자상거래법: 소비자 불만·분쟁처리 기록 3년</li>
              <li>통신비밀보호법: 로그인 기록 3개월</li>
            </ul>
          </Section>

          <Section title="4. 제3자 제공">
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 다음의 경우는 예외입니다.
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>이용자가 사전에 동의한 경우(예: 본사 상담 신청 시 해당 본사에 연락처 전달)</li>
              <li>법령에 의해 제출 의무가 있는 경우</li>
              <li>안전 거래 진행 시 표준 계약 당사자(매도자·매수자) 간 필요 정보 공유</li>
            </ul>
          </Section>

          <Section title="5. 처리 위탁">
            <p>서비스 제공을 위해 다음 업체에 처리를 위탁할 수 있습니다.</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>클라우드 호스팅·데이터베이스(예: Supabase, AWS)</li>
              <li>결제·에스크로 대행사</li>
              <li>이메일·알림 발송 서비스</li>
            </ul>
          </Section>

          <Section title="6. 이용자의 권리">
            이용자는 언제든지 개인정보의 열람·정정·삭제·처리정지를 요청할 수 있습니다. 회원 페이지에서 직접 수정하거나
            개인정보 보호책임자에게 요청해 주세요.
          </Section>

          <Section title="7. 안전성 확보 조치">
            <ul className="ml-4 list-disc space-y-1">
              <li>비밀번호는 단방향 해시로 저장하며 평문으로 보관하지 않습니다.</li>
              <li>전송 구간은 HTTPS(TLS 1.2 이상) 암호화를 적용합니다.</li>
              <li>접근 권한 최소화·접근 기록 보관 등 기술적·관리적 조치를 시행합니다.</li>
            </ul>
          </Section>

          <Section title="8. 쿠키 및 추적 기술">
            서비스 이용 편의성 향상을 위해 쿠키를 사용합니다. 이용자는 브라우저 설정으로 쿠키 저장을 거부할 수 있으나, 일부
            서비스 이용이 제한될 수 있습니다.
          </Section>

          <Section title="9. 개인정보 보호책임자">
            <ul className="ml-4 list-disc space-y-1">
              <li>책임자: 개인정보 보호 담당자</li>
              <li>문의: privacy@pchahub.kr</li>
            </ul>
          </Section>

          <p className="border-t border-gray-100 pt-6 text-xs text-gray-500">
            본 페이지는 9개 사이트 공통 개인정보처리방침입니다. 변경 시 공지를 통해 안내합니다.
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
