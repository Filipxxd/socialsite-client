import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate, NavLink } from "react-router-dom";
import {
  Image,
  Group,
  Burger,
  Button,
  Divider,
  Box,
  Drawer,
  ScrollArea,
  rem,
} from "@mantine/core";
import { useAuth } from "../../shared/AuthContext";
import classes from "./Header.module.css";

export default function Header() {
  const [menuOpened, { toggle: toggleMenu, close: closeMenu }] =
    useDisclosure(false);
  const navigate = useNavigate();

  const { isAuthenticated, fullname } = useAuth();
  const navigateAndClose = (path: string) => {
    navigate(path);
    closeMenu();
  };

  const NavLinkItem = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <NavLink to={to} className={classes.link} onClick={closeMenu}>
      {children}
    </NavLink>
  );

  return (
    <Box mb={20}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link to="/">
            <Image src="/logo.svg" height={45} />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <NavLinkItem to="/profile">My Profile</NavLinkItem>
            <NavLinkItem to="/friends">Friendslist</NavLinkItem>
            <NavLinkItem to="/chats">Chats</NavLinkItem>
          </Group>

          {isAuthenticated ? (
            <div>Hello {fullname}</div>
          ) : (
            <Group visibleFrom="sm">
              <Button variant="default" onClick={() => navigate("/login")}>
                Sign in
              </Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </Group>
          )}

          <Burger
            opened={menuOpened}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={menuOpened}
        onClose={closeMenu}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          <NavLinkItem to="/">Home</NavLinkItem>
          <NavLinkItem to="/learn">Learn</NavLinkItem>
          <NavLinkItem to="/academy">Academy</NavLinkItem>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            <Button
              variant="default"
              onClick={() => navigateAndClose("/login")}
            >
              Sign in
            </Button>
            <Button onClick={() => navigateAndClose("/register")}>
              Sign up
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
