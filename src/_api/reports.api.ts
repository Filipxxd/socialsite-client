import authAxiosInstance from "../_auth/authAxios.ts"
import {AxiosResponse} from "axios";

export type ReportResponse = {
    reportId: number;
    content: string;
    dateCreated: string;
    type: ReportType;
    state: ReportState;
    reporterFullname: string;
    postId: number;
    postContent: string;
    postImages: File[];
    postCreatorFullname: string;
}

export enum ReportType{
    Offensive,
    FakeNews,
    Other
}

export enum ReportState
{
    Approved,
    Declined,
    Pending
}

const mockReports: ReportResponse[] = [
    {
        reportId: 1,
        content: 'This post is offensive and violates the guidelines.',
        dateCreated: '2024-12-01T10:00:00Z',
        type: ReportType.Offensive,
        state: ReportState.Pending,
        reporterFullname: 'John Doe',
        postId: 101,
        postContent: 'Check out this post, it contains offensive content.',
        postImages: [],
        postCreatorFullname: 'Alice Smith',
    },
    {
        reportId: 2,
        content: 'The news in this post is false and misleading.',
        dateCreated: '2024-12-01T11:00:00Z',
        type: ReportType.FakeNews,
        state: ReportState.Pending,
        reporterFullname: 'Jane Doe',
        postId: 102,
        postContent: 'This is a fake news post.',
        postImages: [],
        postCreatorFullname: 'Bob Johnson',
    },
    {
        reportId: 3,
        content: 'This post contains offensive language and slurs.',
        dateCreated: '2024-12-02T10:15:00Z',
        type: ReportType.Offensive,
        state: ReportState.Pending,
        reporterFullname: 'Alice Green',
        postId: 103,
        postContent: 'This post uses offensive language.',
        postImages: [],
        postCreatorFullname: 'Eve White',
    },
    {
        reportId: 4,
        content: 'The article is full of misinformation about vaccines.',
        dateCreated: '2024-12-02T12:00:00Z',
        type: ReportType.FakeNews,
        state: ReportState.Approved,
        reporterFullname: 'Charlie Black',
        postId: 104,
        postContent: 'Misinformation about vaccines is being spread in this article.',
        postImages: [],
        postCreatorFullname: 'Grace Blue',
    },
    {
        reportId: 5,
        content: 'This post contains violent threats against a public figure.',
        dateCreated: '2024-12-03T14:30:00Z',
        type: ReportType.Offensive,
        state: ReportState.Pending,
        reporterFullname: 'David Brown',
        postId: 105,
        postContent: 'Violent threats are included in this post.',
        postImages: [],
        postCreatorFullname: 'Hannah Green',
    },
    {
        reportId: 6,
        content: 'The post contains false claims about the environment.',
        dateCreated: '2024-12-03T15:45:00Z',
        type: ReportType.FakeNews,
        state: ReportState.Declined,
        reporterFullname: 'Emma White',
        postId: 106,
        postContent: 'This post has false environmental claims.',
        postImages: [],
        postCreatorFullname: 'Liam Brown',
    },
    {
        reportId: 7,
        content: 'This post is inappropriate and should be flagged.',
        dateCreated: '2024-12-04T09:00:00Z',
        type: ReportType.Other,
        state: ReportState.Pending,
        reporterFullname: 'Frank Black',
        postId: 107,
        postContent: 'Inappropriate content is present in this post.',
        postImages: [],
        postCreatorFullname: 'Olivia Davis',
    },
    {
        reportId: 8,
        content: 'The post is offensive and should be reviewed by the team.',
        dateCreated: '2024-12-04T11:15:00Z',
        type: ReportType.Offensive,
        state: ReportState.Approved,
        reporterFullname: 'George Green',
        postId: 108,
        postContent: 'Offensive content is present in the post.',
        postImages: [],
        postCreatorFullname: 'Mia Brown',
    },
    {
        reportId: 9,
        content: 'This news article is filled with inaccuracies and false claims.',
        dateCreated: '2024-12-04T13:30:00Z',
        type: ReportType.FakeNews,
        state: ReportState.Pending,
        reporterFullname: 'Isla Blue',
        postId: 109,
        postContent: 'False claims about the economy are present in this article.',
        postImages: [],
        postCreatorFullname: 'Jack White',
    },
    {
        reportId: 10,
        content: 'This post violates community standards with offensive language.',
        dateCreated: '2024-12-04T15:00:00Z',
        type: ReportType.Offensive,
        state: ReportState.Declined,
        reporterFullname: 'Jack Green',
        postId: 110,
        postContent: 'Offensive language is used in the post.',
        postImages: [],
        postCreatorFullname: 'Sophia Blue',
    }
];

export const getReports = async (): Promise<AxiosResponse<ReportResponse[]>> => {
    return await authAxiosInstance.get<ReportResponse[]>('/api/reports/get-all');
};

export const getReportsMocked = (): ReportResponse[] => mockReports;

export type ReportStateChangeRequest = {
  postId: number;
  postState: ReportState;
};

export const changeReportState = async(data: ReportStateChangeRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.put('/api/reports/change-state', {
      PostId: data.postId,
      PostState: data.postState,
  });
};

export type UserNotificationRequest = {
    postId: number;

}

export const notifyUser = async(data: UserNotificationRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post('/api/users/notify', {
      PostId: data.postId
  })
};