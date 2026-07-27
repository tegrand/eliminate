import { z } from "zod";
const baseSchema = {
  categoryId: z.string().uuid("Invalid category ID format").optional().nullable(),
};
const schema = z.object(baseSchema).strict();
try {
  schema.parse({});
  console.log("Empty object passed");
} catch(e) {
  console.log("Empty object failed:", e.errors);
}
try {
  schema.parse({ categoryId: null });
  console.log("null passed");
} catch(e) {
  console.log("null failed:", e.errors);
}
try {
  schema.parse({ categoryId: undefined });
  console.log("undefined passed");
} catch(e) {
  console.log("undefined failed:", e.errors);
}
try {
  schema.parse({ categoryId: "" });
  console.log("empty string passed");
} catch(e) {
  console.log("empty string failed:", e.errors);
}
