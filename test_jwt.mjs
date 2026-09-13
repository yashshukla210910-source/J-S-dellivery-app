import { SignJWT, jwtVerify } from "jose";

const key = new TextEncoder().encode("localmart_secret_super_secure_key_123");

async function test() {
  try {
    const payload1 = { id: 1, role: "USER" };
    const token1 = await new SignJWT(payload1)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(key);
      
    console.log("Token 1 created");
    
    const { payload: parsed } = await jwtVerify(token1, key, { algorithms: ["HS256"] });
    console.log("Parsed:", parsed);
    
    // Simulating encrypt(parsed)
    const token2 = await new SignJWT(parsed)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(key);
      
    console.log("Token 2 created successfully");
  } catch (e) {
    console.error("ERROR:", e);
  }
}

test();
