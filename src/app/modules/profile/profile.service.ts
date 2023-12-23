import { User } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import { prismaExclude } from "../../../helpers/prismaExcludeHelper";
import { prisma } from "../../../shared/prisma";

export const getUserProfileFromDB = async (
  user: JwtPayload | null
): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (result) {
    const userWithoutPassword = prismaExclude<User, "password">(result, [
      "password",
    ]);
    return userWithoutPassword;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
};
