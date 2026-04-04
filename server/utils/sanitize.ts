export interface UserOutput {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  status: string;
  departmentId: string | null;
  createdAt: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeUser(user: any): UserOutput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe as UserOutput;
}
