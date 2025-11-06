import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  Integrations: defineTable({
    orgId: v.string(),

    integrationType: v.union(
      v.literal("meta"),
      v.literal("google"),
      v.literal("custom")
    ),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    tokenExpiresAt: v.optional(v.number()),
    isWebhookSubscribed: v.optional(v.boolean()),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("byOrgId", ["orgId"]),

  metaForms: defineTable({
    orgId: v.string(),
    metaFormId: v.string(),
    formName: v.string(),

    pageName: v.string(),
    pageId: v.string(),

    businessName: v.string(),
    businessId: v.string(),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("byOrgId", ["orgId"]),

  metaWebhookEvents: defineTable({
    eventId: v.string(),
    payload: v.any(),

    receivedAt: v.number(),
  }),

  leads: defineTable({
    orgId: v.string(),
    metaFormId: v.id("metaForms"),
    metaFormSubmissionId: v.string(),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    country: v.optional(v.string()),
    state: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    customFields: v.optional(v.any()),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("byOrgId", ["orgId"]),
});

export default schema;
