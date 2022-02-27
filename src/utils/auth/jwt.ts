import { Request } from "express";
import { PassportStatic } from "passport";
import { StrategyOptions } from "passport-jwt";
import UserService from "../../atoms/users/service";

const JwtStrategy = require("passport-jwt").Strategy;

const extractor = (req: Request) => {
  let token = req.headers.authorization;
  token = token?.replace("Bearer ", "");

  if (req && req.cookies) {
    token = req.cookies.token || token;
  }

  return token || "";
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
