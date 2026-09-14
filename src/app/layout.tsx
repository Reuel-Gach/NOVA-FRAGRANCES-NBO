import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-white dark:bg-[#060908] text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}