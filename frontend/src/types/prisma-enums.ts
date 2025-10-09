// Prisma enum types from the backend schema
export enum ShoeSize {
  UK6 = "UK6",
  UK7 = "UK7",
  UK8 = "UK8",
  UK9 = "UK9",
  UK10 = "UK10",
  UK11 = "UK11"
}

export enum ShoeColor {
  RED = "RED",
  BLACK = "BLACK",
  WHITE = "WHITE",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  GREY = "GREY"
}

export enum UserRole {
  USER = "USER",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED"
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

// Type helpers
export type ShoeSizeType = keyof typeof ShoeSize;
export type ShoeColorType = keyof typeof ShoeColor;
export type UserRoleType = keyof typeof UserRole;
export type PaymentStatusType = keyof typeof PaymentStatus;
export type OrderStatusType = keyof typeof OrderStatus;

// Value arrays for dropdowns
export const SHOE_SIZES = Object.values(ShoeSize);
export const SHOE_COLORS = Object.values(ShoeColor);
export const USER_ROLES = Object.values(UserRole);
export const PAYMENT_STATUSES = Object.values(PaymentStatus);
export const ORDER_STATUSES = Object.values(OrderStatus);