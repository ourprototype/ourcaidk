import './globals.css'

export const metadata = {
  title: 'our.ca - Canada\'s Modern Directory',
  description: 'Helping businesses and individuals control how they\'re found and contacted.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
