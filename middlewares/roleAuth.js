const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated and has the required role
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

export default roleAuth;
