import { baseApi } from "./baseApi";

const URL = "/backup";

export const backupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBackupInfo: build.query<any, void>({
      query: () => ({ url: URL, method: "GET" }),
      providesTags: ["Backup"],
    }),
    exportBackup: build.query<any, void>({
      query: () => ({ url: `${URL}/export`, method: "GET" }),
      providesTags: ["Backup"],
    }),
  }),
});

export const { useGetBackupInfoQuery, useExportBackupQuery } = backupApi;
