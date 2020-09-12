/*

 Source Server         : Localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 110003
 Source Host           : localhost:5432
 Source Catalog        : orderservice
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 110003
 File Encoding         : 65001

 Date: 11/09/2020 01:21:19
*/


-- ----------------------------
-- Table structure for customer
-- ----------------------------
DROP TABLE IF EXISTS "public"."customer";
CREATE TABLE "public"."customer" (
  "customerId" uuid NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "fullName" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."customer" OWNER TO "postgres";

-- ----------------------------
-- Table structure for inventory
-- ----------------------------
DROP TABLE IF EXISTS "public"."inventory";
CREATE TABLE "public"."inventory" (
  "productId" uuid NOT NULL,
  "quantity" int4
)
;
ALTER TABLE "public"."inventory" OWNER TO "postgres";

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS "public"."order";
CREATE TABLE "public"."order" (
  "orderId" uuid NOT NULL,
  "date" date,
  "status" varchar(64) COLLATE "pg_catalog"."default",
  "productId" uuid,
  "quantity" int4,
  "customerId" uuid
)
;
ALTER TABLE "public"."order" OWNER TO "postgres";

-- ----------------------------
-- Table structure for order_product
-- ----------------------------
DROP TABLE IF EXISTS "public"."order_product";
CREATE TABLE "public"."order_product" (
  "orderId" uuid,
  "productId" uuid,
  "quantity" int4
)
;
ALTER TABLE "public"."order_product" OWNER TO "postgres";

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS "public"."product";
CREATE TABLE "public"."product" (
  "name" varchar(32) COLLATE "pg_catalog"."default",
  "description" varchar(255) COLLATE "pg_catalog"."default",
  "price" numeric(10,2),
  "productId" uuid NOT NULL
)
;
ALTER TABLE "public"."product" OWNER TO "postgres";

-- ----------------------------
-- Primary Key structure for table customer
-- ----------------------------
ALTER TABLE "public"."customer" ADD CONSTRAINT "customer_pkey" PRIMARY KEY ("customerId");

-- ----------------------------
-- Primary Key structure for table order
-- ----------------------------
ALTER TABLE "public"."order" ADD CONSTRAINT "order_pkey" PRIMARY KEY ("orderId");

-- ----------------------------
-- Primary Key structure for table product
-- ----------------------------
ALTER TABLE "public"."product" ADD CONSTRAINT "product_pkey" PRIMARY KEY ("productId");

-- ----------------------------
-- Foreign Keys structure for table inventory
-- ----------------------------
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product" ("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table order
-- ----------------------------
ALTER TABLE "public"."order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer" ("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."order" ADD CONSTRAINT "order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Uniques structure for table inventory
-- ----------------------------
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_productId_key" UNIQUE ("productId");

-- ----------------------------
-- Records of product
-- ----------------------------
BEGIN;
INSERT INTO "public"."product" VALUES ('MacBook Pro 2020 ', '15 inch core i7', 3000.00, '2e6de3b7-fcda-4b0e-8fd4-53eee2c34e99');
INSERT INTO "public"."product" VALUES ('Iphone X', '512x', 1100.00, 'd85b7583-e410-419a-92fb-7708cc17e01a');
COMMIT;

-- ----------------------------
-- Records of inventory
-- ----------------------------
BEGIN;
INSERT INTO "public"."inventory" VALUES ('2e6de3b7-fcda-4b0e-8fd4-53eee2c34e99', 20);
INSERT INTO "public"."inventory" VALUES ('d85b7583-e410-419a-92fb-7708cc17e01a', 30);
COMMIT;