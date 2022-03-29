import jwt from "jsonwebtoken";

export default (authorization: string): number => {
  const token = authorization.replace("Bearer ", "");

  const payload = jwt.decode(token);

  return (payload as any).id;
};
