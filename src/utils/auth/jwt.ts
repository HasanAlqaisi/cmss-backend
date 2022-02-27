import { PassportStatic } from "passport";
import { ExtractJwt, StrategyOptions } from "passport-jwt";
import UserService from "../../atoms/users/service";
import prisma from "../../prisma";

const JwtStrategy = require("passport-jwt").Strategy;

export default function jwtConfig(passport: PassportStatic) {
  const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
      try {
        const user = await UserService.findById(payload.id);
        if (user) return done(null, user);

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
}
