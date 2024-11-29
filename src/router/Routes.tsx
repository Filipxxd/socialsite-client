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
  MyProfileRoute
} from "../_constants/routes.constants";

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
