import Providers from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connect from '../../../utils/db';
import User from '../../../model/User';
import bcrypt from 'bcryptjs';


export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        await connect();

        const { email, password } = credentials;

        const authUser = await User.findOne({ email });
        if (!authUser) {
          throw new Error('No user found with that email');
        }

        const isValid = await bcrypt.compare(password, authUser.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return { id: authUser._id, email: authUser.email };
      },
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/auth/signin',
  },
});

