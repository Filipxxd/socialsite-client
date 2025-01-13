import authAxiosInstance from "../_auth/authAxios.ts"
import { PaginatedResponse } from "../_helpers/pagination.helper.ts";
import { PostResponse } from "./posts.api.ts";

export enum ReportType {
  Offensive = "Offensive",
  FakeNews = "Fake News",
  Other = "Other"
}

export type ReportResponse = {
    reportId: number;
    post: PostResponse;
    content: string;
    dateCreated: Date;
    type: ReportType;
    reporterFullname: string;
    reporterProfilePicturePath: string | null;
}

export type ReportsFilterRequest = {
  pageNumber: number;
  pageSize: number;
}

export const getReports = async (filter: ReportsFilterRequest) => {
  const params = new URLSearchParams({
    PageSize: filter.pageSize.toString(),
    PageNumber: filter.pageNumber.toString()
  });

  return await authAxiosInstance.get<PaginatedResponse<ReportResponse>>(`/api/reports?${params}`);
};

export type CreateReportRequest = {
  postId: number;
  content: string;
  type: ReportType;
}

export const createReport = async (data: CreateReportRequest) => {
  return await authAxiosInstance.post(`/api/reports`, {
    PostId: data.postId,
    Content: data.content,
    Type: data.type
  });
}

export type ResolveReportRequest = {
  reportId: number;
  accepted: boolean;
}

export const resolveReport = async (data: ResolveReportRequest) => {
  return await authAxiosInstance.post(`/api/reports/${data.reportId}`, {
    Accepted: data.accepted
  });
}
