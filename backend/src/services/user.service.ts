import { prisma } from "../../prisma/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

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

export function updateUser(id: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({ where: { id }, data });
}

export function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
