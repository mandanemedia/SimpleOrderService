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

 Date: 14/09/2020 00:55:34
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
-- Records of customer
-- ----------------------------
BEGIN;
INSERT INTO "public"."customer" VALUES ('4bfcdc1f-dc2f-4364-96df-8d241dbdb8fa', 'Ryan.Samberg.test@gmail.com', 'Alex Samberg');
COMMIT;

-- ----------------------------
-- Table structure for inventory
-- ----------------------------
DROP TABLE IF EXISTS "public"."inventory";
CREATE TABLE "public"."inventory" (
  "productId" uuid NOT NULL,
  "quantity" int4,
  "color" varchar(32) COLLATE "pg_catalog"."default",
  "size" varchar(32) COLLATE "pg_catalog"."default",
  "inventoryId" uuid NOT NULL
)
;
ALTER TABLE "public"."inventory" OWNER TO "postgres";

-- ----------------------------
-- Records of inventory
-- ----------------------------
BEGIN;
INSERT INTO "public"."inventory" VALUES ('4621f692-0da5-45c6-9b28-68c15689e87f', 50, 'Black', 'Medium', '29ccdff9-4ae5-46d9-a613-ca14c80558fc');
INSERT INTO "public"."inventory" VALUES ('4621f692-0da5-45c6-9b28-68c15689e87f', 50, 'Black', 'Large', '8b2d765f-4770-4e7a-aa65-11d3901f9f17');
INSERT INTO "public"."inventory" VALUES ('4621f692-0da5-45c6-9b28-68c15689e87f', 50, 'Gray', 'Small', '872483d2-594c-4776-a4ad-e5fd6b72c63f');
INSERT INTO "public"."inventory" VALUES ('d85b7583-e410-419a-92fb-7708cc17e01a', 50, 'Black', 'default', '0ff470ec-10bb-4fee-a3f6-c8aa240131a4');
COMMIT;

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS "public"."order";
CREATE TABLE "public"."order" (
  "orderId" uuid NOT NULL,
  "date" date,
  "customerId" uuid,
  "status" varchar(32) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."order" OWNER TO "postgres";

-- ----------------------------
-- Records of order
-- ----------------------------
BEGIN;
INSERT INTO "public"."order" VALUES ('1164ef5c-1657-46b2-bb36-c74080e02b11', '2020-09-12', '4bfcdc1f-dc2f-4364-96df-8d241dbdb8fa', 'Shipped');
INSERT INTO "public"."order" VALUES ('307001cd-4b9a-4283-aa65-0fe2652626f8', '2020-09-14', '4bfcdc1f-dc2f-4364-96df-8d241dbdb8fa', 'Delivered');
COMMIT;

-- ----------------------------
-- Table structure for orderItem
-- ----------------------------
DROP TABLE IF EXISTS "public"."orderItem";
CREATE TABLE "public"."orderItem" (
  "orderId" uuid NOT NULL,
  "inventoryId" uuid NOT NULL,
  "quantity" int4 NOT NULL,
  "orderItemId" uuid NOT NULL
)
;
ALTER TABLE "public"."orderItem" OWNER TO "postgres";

-- ----------------------------
-- Records of orderItem
-- ----------------------------
BEGIN;
INSERT INTO "public"."orderItem" VALUES ('1164ef5c-1657-46b2-bb36-c74080e02b11', '29ccdff9-4ae5-46d9-a613-ca14c80558fc', 3, '2164ef5c-1657-46b2-bb36-c74080e02b12');
INSERT INTO "public"."orderItem" VALUES ('1164ef5c-1657-46b2-bb36-c74080e02b11', '872483d2-594c-4776-a4ad-e5fd6b72c63f', 3, '3164ef5c-1657-46b2-bb36-c74080e02b13');
COMMIT;

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
-- Records of product
-- ----------------------------
BEGIN;
INSERT INTO "public"."product" VALUES ('MacBook Pro 2020 ', '15 inch core i7', 3000.00, '2e6de3b7-fcda-4b0e-8fd4-53eee2c34e99');
INSERT INTO "public"."product" VALUES ('Iphone X', '512x', 1100.00, 'd85b7583-e410-419a-92fb-7708cc17e01a');
INSERT INTO "public"."product" VALUES ('Lululemon pants', 'Commuter', 100.00, '4621f692-0da5-45c6-9b28-68c15689e87f');
COMMIT;

-- ----------------------------
-- Primary Key structure for table customer
-- ----------------------------
ALTER TABLE "public"."customer" ADD CONSTRAINT "customer_pkey" PRIMARY KEY ("customerId");

-- ----------------------------
-- Uniques structure for table inventory
-- ----------------------------
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_productId_key" UNIQUE ("productId", "color", "size");

-- ----------------------------
-- Primary Key structure for table inventory
-- ----------------------------
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_pkey" PRIMARY KEY ("inventoryId");

-- ----------------------------
-- Primary Key structure for table order
-- ----------------------------
ALTER TABLE "public"."order" ADD CONSTRAINT "order_pkey" PRIMARY KEY ("orderId");

-- ----------------------------
-- Uniques structure for table orderItem
-- ----------------------------
ALTER TABLE "public"."orderItem" ADD CONSTRAINT "orderItem_inventoryId_orderId_key" UNIQUE ("inventoryId", "orderId");

-- ----------------------------
-- Primary Key structure for table orderItem
-- ----------------------------
ALTER TABLE "public"."orderItem" ADD CONSTRAINT "order_product_pkey" PRIMARY KEY ("orderItemId");

-- ----------------------------
-- Primary Key structure for table product
-- ----------------------------
ALTER TABLE "public"."product" ADD CONSTRAINT "product_pkey" PRIMARY KEY ("productId");

-- ----------------------------
-- Foreign Keys structure for table inventory
-- ----------------------------
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table order
-- ----------------------------
ALTER TABLE "public"."order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer" ("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table orderItem
-- ----------------------------
ALTER TABLE "public"."orderItem" ADD CONSTRAINT "order_product_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventory" ("inventoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."orderItem" ADD CONSTRAINT "order_product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."order" ("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;
