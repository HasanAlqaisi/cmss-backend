import { User } from "@prisma/client";
import { Request } from "express";
import { PassportStatic } from "passport";
import { StrategyOptions } from "passport-jwt";
import UserService from "../../atoms/users/service";
import { reshapeData } from "../reshape-data";

const JwtStrategy = require("passport-jwt").Strategy;

// export default (passport: PassportStatic) => {
//   const jwtOptions: StrategyOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.TOKEN_SECRET,
//   };

//   passport.use(
//     new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
//       try {
//         const user = await UserService.findById(payload.id);
//         if (user) return done(null, user);

//         return done(null, false);
//       } catch (err) {
//         return done(err, false);
//       }
//     })
//   );
// };

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};

export default (passport: PassportStatic) => {
  const jwtOptions: StrategyOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.TOKEN_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
      try {
        const user = await UserService.findById(payload.id);

        const reshapedUser = reshapeData(user!, ["password"]) as User;

        if (reshapedUser) return done(null, reshapedUser);

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
