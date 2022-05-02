import log from '../utils/Logger';

export const requiresLogin = (req: any, res: any, next: any) => {
  if (req.user) return next();

  log.info(req.sessionID);
  res.status(401).send(null);
};
