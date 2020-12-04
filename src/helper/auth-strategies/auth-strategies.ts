import * as passport from 'passport';
import * as facebook from 'passport-facebook';
import * as google from 'passport-google-oauth20';
import {config} from '../../config';

const FacebookStrategy = facebook.Strategy;
const GoogleStrategy = google.Strategy;

passport.use(new FacebookStrategy({
  clientID: config.FACEBOOK_APP_ID,
  clientSecret: config.FACEBOOK_APP__SECRET,
  callbackURL: 'http://localhost:5000/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
},
((accessToken: string, refreshToken: string, profile: passport.Profile, cb) => {
  console.log(profile);
  cb(null, profile);
})
));

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_SECRET_KEY,
  callbackURL: 'http://localhost:5000/auth/google/callback'

},
((accessToken: string, refreshToken: string, profile: passport.Profile, cb: any) => {
  console.log(profile);
  cb(null, profile);
})
));
