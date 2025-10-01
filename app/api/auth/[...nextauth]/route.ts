// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// import { connectToDatabase } from '@/lib/mongodb';
// import User from '@/models/User';

// const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         mobile: { label: 'Mobile Number', type: 'tel', placeholder: '+94771234567' },
//         password: { label: 'Password', type: 'password' },
//         action: { label: 'Action', type: 'hidden' }, // 'login' or 'register'
//         name: { label: 'Name', type: 'text' }
//       },
//       async authorize(credentials) {
//         if (!credentials?.mobile || !credentials?.password) {
//           throw new Error('Mobile number and password are required');
//         }

//         const { mobile, password, action, name } = credentials;

//         // Validate mobile number format (Sri Lankan format)
//         const mobileRegex = /^(\+94|0)[0-9]{9}$/;
//         if (!mobileRegex.test(mobile)) {
//           throw new Error('Please enter a valid Sri Lankan mobile number');
//         }

//         try {
//           // Connect to database
//           await connectToDatabase();

//           if (action === 'register') {
//             // Registration logic
//             if (!name || name.trim().length < 2) {
//               throw new Error('Name must be at least 2 characters long');
//             }

//             if (password.length < 6) {
//               throw new Error('Password must be at least 6 characters long');
//             }

//             // Check if user already exists
//             const existingUser = await User.findOne({ mobile });
//             if (existingUser) {
//               throw new Error('User with this mobile number already exists');
//             }

//             // Hash password
//             const hashedPassword = await bcrypt.hash(password, 12);

//             // Create new user
//             const newUser = await User.create({
//               name: name.trim(),
//               mobile,
//               password: hashedPassword,
//               role: 'user',
//               isVerified: false
//             });

//             return {
//               id: newUser._id.toString(),
//               name: newUser.name,
//               email: newUser.mobile, // Using mobile as email for NextAuth compatibility
//               mobile: newUser.mobile,
//               role: newUser.role
//             };
//           } else {
//             // Login logic
//             const user = await User.findOne({ mobile });
//             if (!user) {
//               throw new Error('No account found with this mobile number');
//             }

//             const isPasswordValid = await bcrypt.compare(password, user.password);
//             if (!isPasswordValid) {
//               throw new Error('Invalid password');
//             }

//             return {
//               id: user._id.toString(),
//               name: user.name,
//               email: user.mobile, // Using mobile as email for NextAuth compatibility
//               mobile: user.mobile,
//               role: user.role
//             };
//           }
//         } catch (error) {
//           console.error('Auth error:', error);
//           if (error instanceof Error) {
//             throw error;
//           }
//           throw new Error('Authentication failed');
//         }
//       }
//     })
//   ],
//   pages: {
//     signIn: '/auth/signin',
//     signUp: '/auth/signup'
//   },
//   callbacks: {
//     async jwt({ token, user }: any) {
//       if (user) {
//         token.mobile = user.mobile;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }: any) {
//       if (token) {
//         session.user.id = token.sub!;
//         session.user.mobile = token.mobile;
//         session.user.role = token.role;
//       }
//       return session;
//     }
//   },
//   session: {
//     strategy: 'jwt' as const
//   },
//   secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };