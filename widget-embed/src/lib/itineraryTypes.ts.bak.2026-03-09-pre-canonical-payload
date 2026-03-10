/*
  Product: AQUORIX
  File: itineraryTypes.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/lib/itineraryTypes.ts
  Description: Canon itinerary and checkout payload types for Phase 9 widget.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-06
  Version: 1.1.0

  Last Updated: 2026-03-08
  Status: ACTIVE

  Change Log (append-only):
    - 2026-03-06 - v1.0.0:
      - Initial types for itinerary items available vs waitlist.
    - 2026-03-08 - v1.1.0:
      - Add payload schema version 1.0 contract for checkout handoff.
      - Add operator facing sold item label fields.
      - Add currency timezone totals and discount fields.
      - Keep waitlist items informational only and separate from chargeable items.
*/

export type ItineraryItemBase = {
  id: string
  day: string
  isoDate: string
  dateLabel: string
  time: string
  name: string
  entryType: string
  passengerCount: number
}

export type ItineraryAvailableItem = ItineraryItemBase & {
  kind: "available"
}

export type ItineraryWaitlistItem = ItineraryItemBase & {
  kind: "waitlist"
}

export type ItineraryItem = ItineraryAvailableItem | ItineraryWaitlistItem

export type CheckoutChargeableItem = {
  itemId: string
  sessionKey: string
  soldItemLabel: string
  day: string
  isoDate: string
  dateLabel: string
  time: string
  name: string
  entryType: string
  pax: number
  unitPriceMinor: number
  lineTotalMinor: number
  status: "AVAILABLE"
}

export type CheckoutWaitlistItem = {
  itemId: string
  sessionKey: string
  soldItemLabel: string
  day: string
  isoDate: string
  dateLabel: string
  time: string
  name: string
  entryType: string
  pax: number
  status: "WAITLIST"
}

export type CheckoutDiscounts = {
  promo: {
    code: string | null
    amountMinor: number
  }
  greenFins: {
    agreed: boolean
    amountMinor: number
  }
}

export type ItineraryPayload = {
  schemaVersion: "1.0"
  operatorSlug: string
  operatorDisplayName: string
  timezone: string
  currency: string
  createdAtIso: string
  chargeableItems: CheckoutChargeableItem[]
  waitlistItems: CheckoutWaitlistItem[]
  discounts: CheckoutDiscounts
  subtotalMinor: number
  totalMinor: number
}