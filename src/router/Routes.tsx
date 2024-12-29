import Home from "../pages/mainpage/Home";
import Login from "../pages/account/Login";
import Register from "../pages/account/Register";
import Chats from "../pages/chats/Chats";
import CreatePost from "../pages/posts/CreatePost";
import Friends from "../pages/friends/Friends.tsx";
import MyProfile from "../pages/profile/MyProfile.tsx";
import {
  HomeRoute,
  RegisterRoute,
  LoginRoute,
  ChatsRoute,
  FriendsRoute,
  PostsRoute,
  MyProfileRoute,
  UserProfileRoute,
  ReportsRoute
} from "../_constants/routes.constants";
import UserProfile from "../pages/profile/UserProfile.tsx";
import Reports from "../pages/reports/Reports.tsx";

type RouteType = {
  path: string;
  requiresAuth: boolean;
  requiredRoles?: string[];
  component: JSX.Element;
}

export const ROUTES: RouteType[] = [
  // Authorized routes
  {
    path: HomeRoute,
    requiresAuth: true,
    component: <Home />,
  },
  {
    path: FriendsRoute,
    requiresAuth: true,
    component: <Friends />,
  },
  {
    path: ChatsRoute,
    requiresAuth: true,
    component: <Chats />,
  },
  {
    path: MyProfileRoute,
    requiresAuth: true,
    component: <MyProfile />,
  },
  {
    path: PostsRoute,
    requiresAuth: true,
    component: <CreatePost />,
  },
  {
    path: `${UserProfileRoute}/:username`,
    requiresAuth: true,
    component: <UserProfile />,
  },
  // Admin routes
  {
    path: ReportsRoute,
    requiresAuth: false, // TODO: Setup admin auth claim check
    component: <Reports />,
  },
  // Public routes
  {
    path: RegisterRoute,
    requiresAuth: false,
    component: <Register />,
  },
  {
    path: LoginRoute,
    requiresAuth: false,
    component: <Login />,
  }
];
