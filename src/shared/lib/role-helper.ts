export type Role = 'Admin' | 'Manager' | 'Farmer' | 'Viewer';

export const isAdmin = (role: string) => role === 'Admin';
export const isManager = (role: string) => role === 'Admin' || role === 'Manager';
export const isFarmer = (role: string) =>
  role === 'Admin' || role === 'Manager' || role === 'Farmer';

export const canCreateFarm = (role: string) => isManager(role);
export const canCreatePlot = (role: string) => isManager(role);
export const canCreateCrop = (role: string) => isFarmer(role);
export const canRegisterActivity = (role: string) => isFarmer(role);
export const canManageSensors = (role: string) => isManager(role);
export const canInviteUsers = (role: string) => isAdmin(role);
