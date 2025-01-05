import Home from "../pages/mainpage/Home";
import Login from "../pages/account/Login";
import Register from "../pages/account/Register";
import Chats from "../pages/chats/Chats";
import Friends from "../pages/friends/Friends.tsx";
import MyProfile from "../pages/profile/MyProfile.tsx";
import {
  HomeRoute,
  RegisterRoute,
  LoginRoute,
  ChatsRoute,
  FriendsRoute,
  MyProfileRoute,
  UserProfileRoute,
  UserManagerRoute,
  ReportsRoute
} from "../_constants/routes.constants";
import UserProfile from "../pages/profile/UserProfile.tsx";
import Reports from "../pages/reports/Reports.tsx";
import UserManager from "../pages/users/UserManager.tsx";
import { ElevatedUsers, RegularUsers, SuperUsers } from "../_constants/roles.constants.ts";

type RouteType = {
  path: string;
  requiredRoles?: string[];
  component: JSX.Element;
}

export const ROUTES: RouteType[] = [
  {
    path: HomeRoute,
    requiredRoles: RegularUsers,
    component: <Home />,
  },
  {
    path: FriendsRoute,
    requiredRoles: RegularUsers,
    component: <Friends />,
  },
  {
    path: ChatsRoute,
    requiredRoles: RegularUsers,
    component: <Chats />,
  },
  {
    path: MyProfileRoute,
    requiredRoles: RegularUsers,
    component: <MyProfile />,
  },
  {
    path: `${UserProfileRoute}/:username`,
    requiredRoles: RegularUsers,
    component: <UserProfile />,
  },

  {
    path: ReportsRoute,
    requiredRoles: ElevatedUsers,
    component: <Reports />,
  },

  {
    path: UserManagerRoute,
    requiredRoles: SuperUsers,
    component: <UserManager />,
  },

  {
    path: RegisterRoute,
    component: <Register />,
  },
  {
    path: LoginRoute,
    component: <Login />,
  }
];
