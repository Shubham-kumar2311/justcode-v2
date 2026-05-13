import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User, IUser } from '../features/users/user.model';
import { env } from './env';
import crypto from 'crypto';

// Use Google Strategy
if (env.GOOGLE_CLIENT_ID !== 'placeholder') {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists in our db with the given googleId
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // If not, check if user exists with the same email
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

          if (email) {
            user = await User.findOne({ email });

            if (user) {
              // User exists with same email, link the googleId
              user.googleId = profile.id;
              await user.save();
              return done(null, user);
            }
          }

          // Generate a unique username based on the display name or email
          const baseUsername = profile.displayName 
            ? profile.displayName.toLowerCase().replace(/[^a-z0-9]/g, '')
            : (email ? email.split('@')[0] : `user${crypto.randomBytes(4).toString('hex')}`);
          
          let username = baseUsername;
          let counter = 1;
          while (await User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          // If user doesn't exist, create a new user
          user = new User({
            googleId: profile.id,
            email: email || `google_${profile.id}@noemail.com`,
            username,
            role: 'user',
          });

          await user.save();
          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );
}

// Use GitHub Strategy
if (env.GITHUB_CLIENT_ID !== 'placeholder') {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          // Check if user already exists in our db with the given githubId
          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            return done(null, user);
          }

          // If not, check if user exists with the same email
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

          if (email) {
            user = await User.findOne({ email });

            if (user) {
              // User exists with same email, link the githubId
              user.githubId = profile.id;
              await user.save();
              return done(null, user);
            }
          }

          // Generate a unique username based on the display name, login, or email
          const baseUsername = profile.username 
            ? profile.username.toLowerCase().replace(/[^a-z0-9]/g, '')
            : (profile.displayName 
                ? profile.displayName.toLowerCase().replace(/[^a-z0-9]/g, '')
                : (email ? email.split('@')[0] : `user${crypto.randomBytes(4).toString('hex')}`)
              );
          
          let username = baseUsername;
          let counter = 1;
          while (await User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          // If user doesn't exist, create a new user
          user = new User({
            githubId: profile.id,
            email: email || `github_${profile.id}@noemail.com`,
            username,
            role: 'user',
          });

          await user.save();
          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );
}

export default passport;
