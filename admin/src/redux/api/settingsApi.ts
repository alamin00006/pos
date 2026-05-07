import { baseApi } from "./baseApi";

const URL = "/settings";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSettings: build.query<any, void>({
      query: () => ({ url: URL, method: "GET" }),
      providesTags: ["Setting"],
    }),
    getSettingByKey: build.query<any, string>({
      query: (key) => ({ url: `${URL}/${key}`, method: "GET" }),
      providesTags: ["Setting"],
    }),
    upsertSetting: build.mutation<any, any>({
      query: (data) => ({ url: URL, method: "POST", data }),
      invalidatesTags: ["Setting"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetSettingByKeyQuery,
  useUpsertSettingMutation,
} = settingsApi;
