-- CreateTable
CREATE TABLE "facturas_compras" (
    "id" TEXT NOT NULL,
    "numeroFactura" INTEGER NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "timbrado" INTEGER NOT NULL,
    "condicion" TEXT NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "valor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "facturas_compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas_ventas" (
    "id" TEXT NOT NULL,
    "numeroFactura" INTEGER NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "timbrado" INTEGER NOT NULL,
    "condicion" TEXT NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "valor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "facturas_ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "facturas_compras" ADD CONSTRAINT "facturas_compras_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas_ventas" ADD CONSTRAINT "facturas_ventas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
