import { baseApi } from "./baseApi";

const COMPANY_INFO_URL = "/settings";

const companyInfoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompanyInfo: build.query({
      query: () => ({
        url: `${COMPANY_INFO_URL}`,
        method: "GET",
      }),
      providesTags: ["company_Info"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCompanyInfoQuery } = companyInfoApi;
