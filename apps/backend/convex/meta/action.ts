import { action } from "../_generated/server";

const META_API_VERSION = "v24.0";
const META_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export const getMetaAllForms = action({
  args: {},
  handler: () => {
    return "success";
  },
});

const GetAllPages = async (accessToken: string) => {
  const response = await fetch(
    `${META_GRAPH_URL}/me/accounts?access_token=${accessToken}`,
    {
      method: "GET",
    }
  );
  return response.json();
};

const GetAllForms = async (accessToken: string) => {
  const response = await fetch(
    `${META_GRAPH_URL}/me/accounts?access_token=${accessToken}`,
    {
      method: "GET",
    }
  );
  return response.json();
};
