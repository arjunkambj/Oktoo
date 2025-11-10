export const META_API_VERSION = "v24.0";
export const META_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;

const LEAD_FIELDS = [
  "id",
  "created_time",
  "field_data",
  "form_id",
  "page_id",
  "is_organic",
  "ad_id",
  "ad_name",
  "adset_id",
  "adset_name",
  "adgroup_id",
  "adgroup_name",
  "campaign_id",
  "campaign_name",
];

export const fetchMetaPages = async (accessToken: string) => {
  const pages = await fetch(
    `${META_GRAPH_URL}/me/accounts?access_token=${accessToken}&fields=id,name,access_token,category`
  );

  return pages.json();
};

export const fetchMetaForms = async (pageId: string, accessToken: string) => {
  const forms = await fetch(
    `${META_GRAPH_URL}/${pageId}/leadgen_forms?access_token=${accessToken}&fields=id,name,locale`
  );

  return forms.json();
};

export const fetchMetaLeads = async (formId: string, accessToken: string) => {
  const url = new URL(`${META_GRAPH_URL}/${formId}/leads`);
  url.searchParams.append("access_token", accessToken);
  url.searchParams.append("fields", LEAD_FIELDS.join(","));

  const leads = await fetch(url.toString());
  return leads.json();
};

export const fetchFromUrl = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

export const normalizeFieldName = (fieldName: string): string => {
  return fieldName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const subscribeToWebhook = async (
  pageAccessToken: string,
  pageId: string
) => {
  try {
    const response = await fetch(
      `${META_GRAPH_URL}/${pageId}/subscribed_apps`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscribed_fields: ["leadgen"],
          access_token: pageAccessToken,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Page subscribed successfully!");
    } else {
      console.error("Subscription failed:", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
