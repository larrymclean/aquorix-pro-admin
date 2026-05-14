/*
  Product: AQUORIX
  File: itineraryTypes.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/lib/itineraryTypes.ts
  Description: Canon itinerary types for Phase 9 widget (available items vs waitlist items).

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-06
  Version: 1.0.0

  Last Updated: 2026-03-06
  Status: ACTIVE

  Change Log (append-only):
    - 2026-03-06 - v1.0.0:
      - Initial types for itinerary items (available vs waitlist).
*/

export type ItineraryItemBase = {
  id: string
  day: string
  isoDate: string
  dateLabel: string
  time: string
  name: string
  entryType: string
}

export type ItineraryAvailableItem = ItineraryItemBase & {
  kind: "available"
}

export type ItineraryWaitlistItem = ItineraryItemBase & {
  kind: "waitlist"
}

export type ItineraryItem = ItineraryAvailableItem | ItineraryWaitlistItem

export type ItineraryPayload = {
  operatorSlug?: string
  createdAtIso: string
  available: ItineraryAvailableItem[]
  waitlist: ItineraryWaitlistItem[]
}