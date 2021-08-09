import { UserRole } from "@models/user/user";
import { InvalidAuthorizationRoleError } from "@utils/api/access-errors";
import { Types } from "mongoose";

export default function handleNeitherAuthorNorAdmin(
  ctx: any,
  authorId: Types.ObjectId
) {
  console.log("author id?", authorId, "payload iss?", ctx.payload.iss);
  if (ctx.payload.role != UserRole.ADMIN && ctx.payload.iss != authorId) {
    throw new InvalidAuthorizationRoleError("Unauthorized");
  }
}
