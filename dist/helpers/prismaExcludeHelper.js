"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaExclude = void 0;
const prismaExclude = (obj, keys) => {
  const filteredEntries = Object.entries(obj).filter(
    ([key]) => !keys.includes(key)
  );
  return Object.fromEntries(filteredEntries);
};
exports.prismaExclude = prismaExclude;
