import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { normalizeFieldName } from "./utils";

export const saveMetaForm = internalMutation({
  args: {
    teamId: v.string(),
    metaPageId: v.string(),
    pageName: v.string(),
    pageAccessToken: v.string(),
    form: v.object({
      id: v.string(),
      name: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { teamId, metaPageId, form, pageName, pageAccessToken } = args;

    const metaForm = await ctx.db
      .query("metaForms")
      .withIndex("byTeamIdAndMetaPageIdAndFormId", (q) =>
        q
          .eq("teamId", teamId)
          .eq("metaPageId", metaPageId)
          .eq("formId", form.id)
      )
      .first();

    if (metaForm) {
      await ctx.db.patch(metaForm._id, {
        formName: form.name,
        pageName,
        pageAccessToken,
        updatedAt: Date.now(),
      });

      return true;
    }

    await ctx.db.insert("metaForms", {
      teamId,
      metaPageId,
      pageName,
      pageAccessToken,
      formId: form.id,
      formName: form.name,
      isPrimary: false,
      isWebhookSubscribed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return true;
  },
});

export const getPrimaryMetaForms = internalQuery({
  args: {
    teamId: v.string(),
  },
  handler: async (ctx, args) => {
    const { teamId } = args;

    const metaForms = await ctx.db
      .query("metaForms")
      .withIndex("byTeamIdAndisprimary", (q) =>
        q.eq("teamId", teamId).eq("isPrimary", true)
      )
      .collect();

    return metaForms;
  },
});

export const saveMetaLead = internalMutation({
  args: {
    teamId: v.string(),
    metaFormId: v.id("metaForms"),
    formId: v.string(),
    lead: v.object({
      id: v.string(),
      created_time: v.string(),
      field_data: v.array(
        v.object({
          name: v.string(),
          values: v.array(v.string()),
        })
      ),
      ad_id: v.string(),
      ad_name: v.string(),
      adset_id: v.string(),
      adset_name: v.string(),
      campaign_id: v.string(),
      campaign_name: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { teamId, metaFormId, formId, lead } = args;

    // Check if lead already exists
    const existingLead = await ctx.db
      .query("leads")
      .withIndex("byMetaLeadId", (q) => q.eq("metaLeadId", lead.id))
      .first();

    if (existingLead) {
      return existingLead._id;
    }

    // Normalize field names and convert values array to string
    const normalizedFieldData = lead.field_data.map((field) => ({
      name: normalizeFieldName(field.name),
      value: field.values.join(", "),
    }));

    // Parse created_time to timestamp
    const capturedAt = new Date(lead.created_time).getTime();

    // Insert lead into database
    const leadId = await ctx.db.insert("leads", {
      teamId,
      metaFormId,
      metaLeadId: lead.id,
      adid: lead.ad_id,
      adName: lead.ad_name,
      adSetId: lead.adset_id,
      adSetName: lead.adset_name,
      campaignId: lead.campaign_id,
      campaignName: lead.campaign_name,
      fieldData: normalizedFieldData,
      capturedAt,
      updatedAt: Date.now(),
    });

    return leadId;
  },
});
