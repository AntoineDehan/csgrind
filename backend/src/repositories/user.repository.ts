import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { UpdateUserInput } from "../schemas/user.schema";

export function findAllUsers() {
  return prisma.user.findMany();
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    omit: { password: false },
  });
}

export function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({ data });
}

export function updateUser(id: string, data: UpdateUserInput) {
  return prisma.user.update({
    where: { id },
    data: data as Prisma.UserUncheckedUpdateInput,
  });
}

export function linkSteamAccount(userId: string, steam64Id: string) {
  return prisma.user.update({ where: { id: userId }, data: { steam64Id } });
}

export function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
