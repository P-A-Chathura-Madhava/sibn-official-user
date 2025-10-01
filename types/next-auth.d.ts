import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mobile?: string;
      role?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    mobile?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    mobile?: string;
    role?: string;
  }
}