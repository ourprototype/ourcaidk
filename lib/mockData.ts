export interface Business {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  city: string
  province: string
  verified: boolean
}

export interface Individual {
  id: string
  name: string
  email?: string
  phone?: string
  city: string
  province: string
  premium: boolean
}

export const mockBusinesses: Business[] = [
  {
    id: 'b1',
    name: 'Pizza Palace Downtown',
    phone: '(416) 555-0123',
    email: 'contact@pizzapalace.ca',
    address: '123 King St W',
    city: 'Toronto',
    province: 'ON',
    verified: true
  },
  {
    id: 'b2',
    name: 'Tech Solutions Inc',
    phone: '(416) 555-0456',
    address: '456 Bay St Suite 1200',
    city: 'Toronto',
    province: 'ON',
    verified: false
  },
  {
    id: 'b3',
    name: 'Green Leaf Cafe',
    phone: '(604) 555-0789',
    email: 'hello@greenleaf.ca',
    address: '789 Granville St',
    city: 'Vancouver',
    province: 'BC',
    verified: true
  }
]

export const mockIndividuals: Individual[] = [
  {
    id: 'i1',
    name: 'Maxwell Franschman',
    email: 'max@our.ca',
    phone: '(437) 996-0808',
    city: 'Toronto',
    province: 'ON',
    premium: true
  },
  {
    id: 'i2',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    city: 'Vancouver',
    province: 'BC',
    premium: true
  },
  {
    id: 'i3',
    name: 'James Rodriguez',
    phone: '(647) 555-2222',
    city: 'Toronto',
    province: 'ON',
    premium: false
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
      b.name.toLowerCase().includes(q) || b.phone.includes(q)
    )
    individuals = individuals.filter(i => 
      i.name.toLowerCase().includes(q) || i.phone?.includes(q)
    )
  }
  
  if (type === 'businesses') return { businesses, individuals: [] }
  if (type === 'people') return { businesses: [], individuals }
  return { businesses, individuals }
}
