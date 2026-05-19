import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
})

export const config = {
  // Protect: my page, HQ console, admin console
  matcher: ['/mypage/:path*', '/hq/:path*', '/admin/:path*'],
}
