import { useDisclosure } from "@mantine/hooks";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Image,
  Group,
  Burger,
  Button,
  Divider,
  Box,
  Drawer,
  Text, Center
} from "@mantine/core";
import { useAuth } from "../../_auth/AuthContext.tsx";
import {
  LoginRoute,
  RegisterRoute,
  FriendsRoute,
  HomeRoute,
  MyProfileRoute,
  UserManagerRoute,
  ReportsRoute
} from "../../_constants/routes.constants.ts";
import { getRefreshToken, removeTokens } from "../../_auth/tokenManager.ts";
import { logout as apiLogout } from "../../_api/account.api.ts";
import { FaUserFriends, FaUserCircle, FaFlag } from "react-icons/fa";
import classes from "./Header.module.css";
import { showSuccessToast } from "../../_helpers/toasts.helper.ts";
import { FaUsers } from "react-icons/fa6";
import { ElevatedUsers, SuperUsers } from "../../_constants/roles.constants.ts";

function Header() {
  const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);
  const navigate = useNavigate();
  const { isAuthenticated, username, logout: contextLogout, role } = useAuth();

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken){
      try{
        await apiLogout(refreshToken);
      }catch{ /* empty */ }
    }

    removeTokens();
    contextLogout();
    showSuccessToast("You have been logged out");
    navigate(LoginRoute);
  };

  const navigateAndClose = (path: string) => {
    navigate(path);
    closeMenu();
  };

  const NavLinkMobile = ({ to, children, label }: { to: string; children: React.ReactNode; label: string }) => (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      <Box
        onClick={closeMenu}
        px="md"
        py="lg"
        display="flex"
        align-items="center"
        className={classes.navLink}
      >
        <Box mr="md" display="flex" align-items="middle" color="inherit">{children}</Box>
        <Text size="lg" w={500}>{label}</Text>
      </Box>
    </NavLink>
  );

  const NavLinkDesktop = ({ to, children, label }: { to: string; children: React.ReactNode; label: string }) => (
    <Box onClick={() => navigate(to)} className={classes.navLink}>
      <Box mr="md" display="flex" align-items="middle">{children}</Box>
      <Text size="md">{label}</Text>
    </Box>
  );

  return (
    <Box mb={20}>
      <header className={classes.header}>
        <Link to={HomeRoute}>
          <Image src="/logo.svg" w={45} />
        </Link>

        {isAuthenticated && (
          <Group visibleFrom="md">
            <NavLinkDesktop to={MyProfileRoute} label="Profile">
              <FaUserCircle />
            </NavLinkDesktop>

            <NavLinkDesktop to={FriendsRoute} label="Friends">
              <FaUserFriends />
            </NavLinkDesktop>

            {/* <NavLinkDesktop to={ChatsRoute} label="Chats">
              <IoChatbox />
            </NavLinkDesktop> */}

            {SuperUsers.some(r => role === r) && (
              <NavLinkDesktop to={UserManagerRoute} label="Users">
                <FaUsers />
              </NavLinkDesktop>
            )}

            {ElevatedUsers.some(r => role === r) && (
              <NavLinkDesktop to={ReportsRoute} label="Reports">
                <FaFlag />
              </NavLinkDesktop>
            )}
          </Group>
        )}

        <Group visibleFrom={"md"}>
          {isAuthenticated ? (
            <Box display="flex" align-items="middle">
              <Box mr="sm" display="flex" align-items="middle">
                <Center>
                  {username}
                </Center>
              </Box>
              <Button onClick={handleLogout}>Logout</Button>
            </Box>
          ) : (
            <>
              <Button onClick={() => navigate(LoginRoute)}>
                Sign in
              </Button>
              <Button onClick={() => navigate(RegisterRoute)}>
                Sign up
              </Button>
            </>
          )}
        </Group>

        <Burger
          opened={menuOpened}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          hiddenFrom="md"
        />
      </header>

      <Drawer
        opened={menuOpened}
        onClose={closeMenu}
        size="100%"
        padding="md"
        title={isAuthenticated ? username : null}
        hiddenFrom="md"
        closeButtonProps={{ size: "xl" }}
        zIndex={1000000}
      >
        <Divider />

        {isAuthenticated && (
          <>
            <NavLinkMobile to={MyProfileRoute} label="My Profile">
              <FaUserCircle />
            </NavLinkMobile>

            <NavLinkMobile to={FriendsRoute} label="Friends">
              <FaUserFriends />
            </NavLinkMobile>

            {/* <NavLinkMobile to={ChatsRoute} label="Chats">
              <IoChatbox />
            </NavLinkMobile> */}

            {SuperUsers.some(r => role === r) && (
              <NavLinkMobile to={UserManagerRoute} label="Users">
                <FaUsers />
              </NavLinkMobile>
            )}

            {ElevatedUsers.some(r => role === r) && (
              <NavLinkMobile to={ReportsRoute} label="Reports">
                <FaFlag />
              </NavLinkMobile>
            )}

            <Divider my="sm" />
          </>
        )}

        <Group justify="center" grow pb="xl" px="md">
          {isAuthenticated ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button variant="default" onClick={() => navigateAndClose(LoginRoute)}>
                Sign in
              </Button>
              <Button onClick={() => navigateAndClose(RegisterRoute)}>
                Sign up
              </Button>
            </>
          )}
        </Group>
      </Drawer>
    </Box>
  );
}

export default Header;