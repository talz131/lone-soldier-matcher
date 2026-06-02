export type Soldier = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  country_of_origin?: string
  base_location?: string
  unit?: string
  service_type?: string
  languages?: string[]
  hebrew_level?: string
  religious_observance?: string
  family_vibe?: string[]
  pets_ok?: boolean
  has_dietary_restrictions?: boolean
  dietary_details?: string
  military_id_url?: string
  status: 'pending' | 'approved' | 'declined' | 'matched'
  admin_notes?: string
  reviewed_at?: string
}

export type HostFamily = {
  id: string
  created_at: string
  contact_name: string
  email: string
  phone?: string
  city?: string
  neighborhood?: string
  family_size?: number
  has_children?: boolean
  children_ages?: string
  living_situation?: string
  available_space?: string
  can_offer_room?: boolean
  can_offer_meals?: boolean
  meal_frequency?: string
  can_offer_activities?: boolean
  activities_description?: string
  can_offer_laundry?: boolean
  can_offer_shabbat?: boolean
  religious_observance?: string
  pets?: string
  additional_notes?: string
  reference_name?: string
  reference_phone?: string
  reference_relationship?: string
  status: 'pending' | 'approved' | 'declined' | 'matched'
  admin_notes?: string
  reviewed_at?: string
}

export type Match = {
  id: string
  created_at: string
  soldier_id: string
  family_id: string
  status: 'active' | 'completed' | 'cancelled'
  notes?: string
  soldiers?: Soldier
  host_families?: HostFamily
}

export type Flag = {
  id: string
  created_at: string
  entity_type: 'soldier' | 'family'
  entity_id: string
  flag_type: 'concern' | 'follow_up' | 'note' | 'red_flag'
  description: string
  resolved: boolean
  resolved_at?: string
}

export type SoldierFormData = {
  firstName: string
  lastName: string
  gender: string
  email: string
  phone: string
  whatsappPhone: string
  dateOfBirth: string
  countryOfOrigin: string
  baseLocation: string
  unit: string
  serviceType: string
  languages: string[]
  hebrewLevel: string
  religiousObservance: string
  familyVibe: string[]
  petsOk: boolean
  hasDietaryRestrictions: boolean
  dietaryDetails: string
  // Step 4 — Reference & Verification
  referenceName: string
  referencePhone: string
  referenceRelationship: string
  referenceAgreed: boolean
  additionalNotes: string
}

export type FamilyFormData = {
  contactName: string
  email: string
  phone: string
  city: string
  neighborhood: string
  familySize: string
  hasChildren: boolean
  childrenAges: string
  livingSituation: string
  availableSpace: string
  hostingType: string
  languages: string[]
  religiousObservance: string
  pets: string
  additionalNotes: string
  soldierGenderPreference: string
  referenceName: string
  referencePhone: string
  referenceRelationship: string
  agreedToTerms: boolean
}
