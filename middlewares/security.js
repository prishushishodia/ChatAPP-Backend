// Lightweight, dependency-free security helpers.
// For production you'd typically use `helmet` and `express-rate-limit`; these
// hand-rolled versions avoid pulling in new packages in this environment.

const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.removeHeader("X-Powered-By");
  next();
};

// Simple in-memory fixed-window rate limiter, keyed by IP + route.
// Good enough to blunt brute-force/credential-stuffing on auth endpoints.
const rateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 20,
  message = "Too many requests, please try again later.",
} = {}) => {
  const hits = new Map(); // key -> { count, resetAt }

  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const entry = hits.get(key);

    // Lazily prune expired entries so the map can't grow unbounded.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count++;
    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ success: false, message });
    }
    next();
  };
};

export { securityHeaders, rateLimiter };
