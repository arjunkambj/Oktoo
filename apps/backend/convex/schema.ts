import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  Integrations: defineTable({
    teamId: v.string(),

    integrationType: v.union(
      v.literal("meta"),
      v.literal("google"),
      v.literal("custom")
    ),
    accessToken: v.optional(v.string()),
    accessTokenExpiresAt: v.number(),
    refreshToken: v.optional(v.string()),
    refreshTokenExpiresAt: v.optional(v.number()),
    isWebhookSubscribed: v.optional(v.boolean()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byTeamId", ["teamId"])
    .index("byIntegrationTypeAndTeamId", ["integrationType", "teamId"]),

  metaPages: defineTable({
    teamId: v.string(),
    pageId: v.string(),
    pageName: v.string(),
    pageAccessToken: v.string(),
    pageAccessTokenExpiresAt: v.number(),
    isWebhookSubscribed: v.optional(v.boolean()),
  }).index("byTeamId", ["teamId"]),

  metaForms: defineTable({
    teamId: v.string(),
    metaPageId: v.id("metaPages"),
    isPrimary: v.optional(v.boolean()),
    formName: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byTeamIdAndIsPrimary", ["teamId", "isPrimary"])
    .index("byMetaPageId", ["metaPageId"]),

  leads: defineTable({
    teamId: v.id("teams"),

    metaFormId: v.id("metaForms"),

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
  }).index("byTeamId", ["teamId"]),
});

export default schema;
