/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as core_onboarding from "../core/onboarding.js";
import type * as http from "../http.js";
import type * as meta_action from "../meta/action.js";
import type * as meta_internal from "../meta/internal.js";
import type * as meta_utils from "../meta/utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "core/onboarding": typeof core_onboarding;
  http: typeof http;
  "meta/action": typeof meta_action;
  "meta/internal": typeof meta_internal;
  "meta/utils": typeof meta_utils;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
