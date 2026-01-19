export interface Business {
  id: string
  slug: string
  name: string
  category?: string
  phone: string
  email?: string
  ourEmail: string
  address: string
  city: string
  province: string
  verified: boolean
  description?: string
  hours?: string
  website?: string
  photos: string[]
  links: { label: string; url: string }[]
  social: { platform: string; handle: string }[]
}

export interface Individual {
  id: string
  slug: string
  name: string
  title?: string
  email?: string
  phone?: string
  ourEmail: string
  city: string
  province: string
  premium: boolean
  bio?: string
  photos: string[]
  links: { label: string; url: string }[]
  social: { platform: string; handle: string }[]
}

export const mockBusinesses: Business[] = [
  {
    id: 'b1',
    slug: 'pizza-palace',
    name: 'Pizza Palace Downtown',
    category: 'Restaurant & Food',
    phone: '(416) 555-0123',
    email: 'contact@pizzapalace.ca',
    ourEmail: 'pizzapalace@our.ca',
    address: '123 King St W',
    city: 'Toronto',
    province: 'ON',
    verified: true,
    description: 'Family-owned pizzeria serving authentic Italian pizza since 1995. We use fresh ingredients, homemade dough, and recipes passed down through generations.',
    hours: 'Mon-Thu: 11am-10pm, Fri-Sat: 11am-12am, Sun: 12pm-9pm',
    website: 'https://pizzapalace.ca',
    photos: ['logo', 'interior', 'pizza'],
    links: [
      { label: 'view our menu', url: '#' },
      { label: 'order online', url: '#' }
    ],
    social: [
      { platform: 'instagram', handle: '@pizzapalaceto' }
    ]
  },
  {
    id: 'b2',
    slug: 'tech-solutions',
    name: 'Tech Solutions Inc',
    category: 'Technology',
    phone: '(416) 555-0456',
    ourEmail: 'techsolutions@our.ca',
    address: '456 Bay St Suite 1200',
    city: 'Toronto',
    province: 'ON',
    verified: false,
    description: 'Enterprise software solutions and IT consulting for businesses of all sizes.',
    photos: ['logo'],
    links: [
      { label: 'our services', url: '#' }
    ],
    social: [
      { platform: 'linkedin', handle: 'tech-solutions-inc' }
    ]
  },
  {
    id: 'b3',
    slug: 'green-leaf-cafe',
    name: 'Green Leaf Cafe',
    category: 'Restaurant & Food',
    phone: '(604) 555-0789',
    email: 'hello@greenleaf.ca',
    ourEmail: 'greenleaf@our.ca',
    address: '789 Granville St',
    city: 'Vancouver',
    province: 'BC',
    verified: true,
    description: 'Plant-based cafe offering organic coffee, fresh juices, and wholesome vegan meals. A cozy spot for mindful eating.',
    hours: 'Daily: 7am-6pm',
    website: 'https://greenleafcafe.ca',
    photos: ['logo', 'interior', 'food'],
    links: [
      { label: 'view menu', url: '#' },
      { label: 'catering info', url: '#' }
    ],
    social: [
      { platform: 'instagram', handle: '@greenleafyvr' },
      { platform: 'linkedin', handle: 'green-leaf-cafe' }
    ]
  },
  {
    id: 'b4',
    slug: 'maple-bistro',
    name: 'Maple Leaf Bistro',
    category: 'Restaurant & Food',
    phone: '(604) 555-9876',
    email: 'info@maplebistro.ca',
    ourEmail: 'maplebistro@our.ca',
    address: '321 Water St',
    city: 'Vancouver',
    province: 'BC',
    verified: true,
    description: 'Farm-to-table Canadian cuisine in the heart of downtown Vancouver. We source locally, cook passionately, and serve with pride. Join us for brunch, lunch, or dinner in our cozy heritage building.',
    hours: 'Tue-Sun: 10am-10pm, Closed Monday',
    website: 'https://maplebistro.ca',
    photos: ['logo', 'interior', 'food'],
    links: [
      { label: 'view our menu', url: '#' },
      { label: 'make a reservation', url: '#' },
      { label: 'gift cards', url: '#' }
    ],
    social: [
      { platform: 'instagram', handle: '@mapleleafbistro' },
      { platform: 'linkedin', handle: 'maple-leaf-bistro' }
    ]
  }
]

export const mockIndividuals: Individual[] = [
  {
    id: 'i1',
    slug: 'maxwell-franschman',
    name: 'Maxwell Franschman',
    title: 'Founder & CEO',
    email: 'max@email.com',
    phone: '(437) 996-0808',
    ourEmail: 'max@our.ca',
    city: 'Toronto',
    province: 'ON',
    premium: true,
    bio: 'Building the future of contact information in Canada. Passionate about connecting people and businesses through simple, elegant solutions.',
    photos: ['main', 'photo2'],
    links: [
      { label: 'our.ca', url: '/' },
      { label: 'linkedin', url: '#' }
    ],
    social: [
      { platform: 'linkedin', handle: 'maxwellfranschman' },
      { platform: 'instagram', handle: '@maxfranschman' }
    ]
  },
  {
    id: 'i2',
    slug: 'sarah-chen',
    name: 'Sarah Chen',
    title: 'UX Designer',
    email: 'sarah.chen@email.com',
    ourEmail: 'sarah.chen@our.ca',
    city: 'Vancouver',
    province: 'BC',
    premium: true,
    bio: 'Product designer focused on creating intuitive digital experiences. Previously at Shopify and Hootsuite. Love hiking and photography in my spare time.',
    photos: ['main', 'photo2', 'photo3'],
    links: [
      { label: 'design portfolio', url: '#' },
      { label: 'dribbble', url: '#' }
    ],
    social: [
      { platform: 'linkedin', handle: 'sarahchen' },
      { platform: 'instagram', handle: '@sarah.designs' }
    ]
  },
  {
    id: 'i3',
    slug: 'james-rodriguez',
    name: 'James Rodriguez',
    title: 'Marketing Consultant',
    phone: '(647) 555-2222',
    ourEmail: 'james.rodriguez@our.ca',
    city: 'Toronto',
    province: 'ON',
    premium: false,
    bio: 'Helping small businesses grow through strategic marketing and brand development.',
    photos: ['main'],
    links: [
      { label: 'book a consultation', url: '#' }
    ],
    social: [
      { platform: 'linkedin', handle: 'jamesrodriguez' }
    ]
  },
  {
    id: 'i4',
    slug: 'jane-smith',
    name: 'Jane Smith',
    title: 'Creative Director & Brand Strategist',
    email: 'jane@email.com',
    phone: '(416) 555-1234',
    ourEmail: 'jane.smith@our.ca',
    city: 'Toronto',
    province: 'ON',
    premium: true,
    bio: 'Award-winning creative director with 15+ years of experience building memorable brands. Specializing in visual identity, digital experiences, and strategic storytelling for startups and established companies alike.',
    photos: ['main', 'photo2', 'photo3'],
    links: [
      { label: 'graphic design portfolio', url: '#' },
      { label: 'resume', url: '#' },
      { label: 'case studies', url: '#' }
    ],
    social: [
      { platform: 'instagram', handle: '@janesmith.design' },
      { platform: 'linkedin', handle: 'janesmith' }
    ]
  }
]

export function searchData(query: string, type: 'all' | 'businesses' | 'people', location?: string) {
  const q = query.toLowerCase()

  let businesses = mockBusinesses
  let individuals = mockIndividuals

  if (location) {
    const loc = location.toLowerCase()
    businesses = businesses.filter(b =>
      b.city.toLowerCase().includes(loc) || b.province.toLowerCase().includes(loc)
    )
    individuals = individuals.filter(i =>
      i.city.toLowerCase().includes(loc) || i.province.toLowerCase().includes(loc)
    )
  }

  if (q) {
    businesses = businesses.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.category?.toLowerCase().includes(q)
    )
    individuals = individuals.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.phone?.includes(q) ||
      i.title?.toLowerCase().includes(q)
    )
  }

  if (type === 'businesses') return { businesses, individuals: [] }
  if (type === 'people') return { businesses: [], individuals }
  return { businesses, individuals }
}

// Helper to get a profile by slug
export function getProfileBySlug(slug: string): { type: 'business' | 'personal', data: Business | Individual } | null {
  const business = mockBusinesses.find(b => b.slug === slug)
  if (business) return { type: 'business', data: business }

  const individual = mockIndividuals.find(i => i.slug === slug)
  if (individual) return { type: 'personal', data: individual }

  return null
}
