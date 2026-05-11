import { enabledProviders } from '@amakers/auth'
import { SigninForm } from './form'

interface SigninPageProps {
  searchParams: { callbackUrl?: string; error?: string }
}

export default function SigninPage({ searchParams }: SigninPageProps) {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-[calc(100vh-64px-200px)] items-center justify-center py-12">
        <SigninForm
          enabled={enabledProviders}
          callbackUrl={searchParams.callbackUrl ?? '/'}
          error={searchParams.error}
        />
      </div>
    </main>
  )
}
