// import jwt from "jsonwebtoken";
// import jwksClient from "jwks-rsa";

// // Keycloak config
// const KEYCLOAK_URL = "https://10.229.40.124:8443";
// const REALM = "chennai-metro";

// // Initialize JWKS client
// const client = jwksClient({
//   jwksUri: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`,
// });

// // Helper: get signing key as a Promise
// function getKey(header) {
//   return new Promise((resolve, reject) => {
//     client.getSigningKey(header.kid, (err, key) => {
//       if (err) return reject(err);
//       if (!key) return reject(new Error("Signing key not found"));
//       resolve(key.getPublicKey());
//     });
//   });
// }

// // Middleware to verify JWT
// export async function keycloakAuth(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "No Authorization header" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decodedHeader = jwt.decode(token, { complete: true });
//     if (!decodedHeader) throw new Error("Invalid token");

//     const key = await getKey(decodedHeader.header);

//     const decoded = jwt.verify(token, key, {
//       algorithms: ["RS256"],
//       issuer: `${KEYCLOAK_URL}/realms/${REALM}`,
//     });

//     req.user = decoded; // attach user info to request
//     next();
//   } catch (err) {
//     console.error("Token verification failed:", err.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// }



import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Keycloak config
const KEYCLOAK_URL = "https://10.229.40.124:8443";
const REALM = "chennai-metro";

// Initialize JWKS client
const client = jwksClient({
  jwksUri: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`,
});

// Helper: get signing key as a Promise
function getKey(header) {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) return reject(err);
      if (!key) return reject(new Error("Signing key not found"));
      resolve(key.getPublicKey());
    });
  });
}

// Middleware to verify JWT
export async function keycloakAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("No Authorization header in request");
    return res.status(401).json({ message: "No Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode token header to get 'kid'
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader) throw new Error("Invalid token header");

    // Get public key dynamically from JWKS
    const key = await getKey(decodedHeader.header);

    // Verify JWT
    const decoded = jwt.verify(token, key, {
      algorithms: ["RS256"],
      issuer: `${KEYCLOAK_URL}/realms/${REALM}`,
    });

    // Attach user info to request
    req.user = decoded;

    // ✅ Logging
    console.log("✅ Token successfully verified by Keycloak");
    console.log("User info:", decoded);
    console.log("Keycloak client (azp claim):", decoded.azp);

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
