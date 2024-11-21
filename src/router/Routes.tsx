import Home from "../pages/mainpage/Home";
import Login from "../pages/account/Login";
import Register from "../pages/account/Register";
import Chats from "../pages/chats/Chats";
import {
  HomeRoute,
  RegisterRoute,
  LoginRoute,
  ChatsRoute
} from "../_constants/routes.constants";

type RouteType = {
  path: string;
  requiresAuth: boolean;
  requiredRoles?: string[];
  component: JSX.Element;
}

export const ROUTES: RouteType[] = [
  {
    path: HomeRoute,
    requiresAuth: true,
    component: <Home />,
  },
  {
    path: RegisterRoute,
    requiresAuth: false,
    component: <Register />,
  },
  {
    path: LoginRoute,
    requiresAuth: false,
    component: <Login />,
  },
  {
    path: ChatsRoute,
    requiresAuth: true,
    component: <Chats />,
  },
];
