import { enabledProviders } from '@amakers/auth'
import { SignupForm } from './form'

export default function SignupPage() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-[calc(100vh-64px-200px)] items-center justify-center py-12">
        <SignupForm enabled={enabledProviders} />
      </div>
    </main>
  )
}
