import Home from "../pages/mainpage/Home";
import Login from "../pages/account/Login";
import Register from "../pages/account/Register";
import Chats from "../pages/chats/Chats";
import CreatePost from "../pages/posts/CreatePost";
import {
  HomeRoute,
  RegisterRoute,
  LoginRoute,
  ChatsRoute, PostsRoute,
} from "../_constants/routes.constants";

interface RouteType {
  path: string;
  element: JSX.Element;
}

export const ROUTES: RouteType[] = [
  {
    path: HomeRoute,
    element: <Home />,
  },
  {
    path: RegisterRoute,
    element: <Register />,
  },
  {
    path: LoginRoute,
    element: <Login />,
  },
  {
    path: ChatsRoute,
    element: <Chats />,
  },
  {
    path: PostsRoute,
    element: <CreatePost />,
  },
];
