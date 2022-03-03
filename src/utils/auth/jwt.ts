import { Request } from "express";
import { PassportStatic } from "passport";
import { StrategyOptions } from "passport-jwt";
import UserService from "../../atoms/users/service";

const JwtStrategy = require("passport-jwt").Strategy;

const extractor = (req: Request) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return token || req.cookies["access-token"];
};

export default function jwtConfig(passport: PassportStatic) {
  const jwtOptions: StrategyOptions = {
    jwtFromRequest: extractor,
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
