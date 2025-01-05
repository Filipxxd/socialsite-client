export const Admin = "Admin";
export const Moderator = "Moderator";
export const User = "User";

export const SuperUsers = [Admin];
export const ElevatedUsers = [Admin, Moderator];
export const RegularUsers = [User, Admin, Moderator];