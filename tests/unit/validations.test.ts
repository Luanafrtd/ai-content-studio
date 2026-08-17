import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { projectSchema } from "@/lib/validations/project";
import { generateSchema } from "@/lib/validations/generate";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "secret123" }).success,
    ).toBe(true);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "" }).success).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "secret123" }).success).toBe(
      false,
    );
  });
});

const validRegistration = {
  name: "Jamie Rivera",
  email: "jamie@example.com",
  password: "password123",
  confirmPassword: "password123",
};

describe("registerSchema", () => {
  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({ ...validRegistration, confirmPassword: "different" });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(registerSchema.safeParse({ ...validRegistration, name: "J" }).success).toBe(false);
  });
});

const validProject = { name: "Q3 Launch", description: "Autumn campaign", color: "teal" as const };

describe("projectSchema", () => {
  it("accepts a valid project", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it("allows an empty description", () => {
    expect(projectSchema.safeParse({ ...validProject, description: "" }).success).toBe(true);
  });

  it("rejects an unknown color", () => {
    expect(projectSchema.safeParse({ ...validProject, color: "chartreuse" }).success).toBe(false);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(projectSchema.safeParse({ ...validProject, name: "Q" }).success).toBe(false);
  });
});

const validGenerate = {
  projectId: "proj_123",
  type: "BLOG_POST" as const,
  prompt: "a sustainable skincare line for sensitive skin",
  tone: "PROFESSIONAL" as const,
  length: "MEDIUM" as const,
};

describe("generateSchema", () => {
  it("accepts a valid generation request", () => {
    expect(generateSchema.safeParse(validGenerate).success).toBe(true);
  });

  it("rejects a prompt shorter than 10 characters", () => {
    expect(generateSchema.safeParse({ ...validGenerate, prompt: "too short" }).success).toBe(false);
  });

  it("rejects a missing projectId", () => {
    expect(generateSchema.safeParse({ ...validGenerate, projectId: "" }).success).toBe(false);
  });

  it("rejects an unknown content type", () => {
    expect(generateSchema.safeParse({ ...validGenerate, type: "HAIKU" }).success).toBe(false);
  });
});
