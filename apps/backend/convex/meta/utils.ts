export const META_API_VERSION = "v24.0";
export const META_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;

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
