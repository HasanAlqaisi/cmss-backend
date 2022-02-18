import jwt from "jsonwebtoken";

export default (authorization: string): string => {
  const token = authorization.replace("bearer ", "");

  const payload = jwt.decode(token);

  return (payload as any).id;
};