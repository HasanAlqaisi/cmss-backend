import { PassportStatic } from "passport";
import { ExtractJwt, StrategyOptions } from "passport-jwt";
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
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });
        if (user) return done(null, user);

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
}
