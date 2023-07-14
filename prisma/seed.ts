import { prisma } from "../src/lib/prisma";
import { faker } from "@faker-js/faker";
import cloudinary from "cloudinary";
import { Billboard } from "@prisma/client";

import { getPublicIdFromUrl } from "../src/lib/utils";

cloudinary.v2.config({
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

async function main() {
    console.log("🌱 Seeding...");
    console.time(`🌱 Database has been seeded`);

    //Delete images from Cloudinary.
    console.time("🏙️Images deleted from Cloudinary...");

    const billboardsToDelete: Billboard[] = await prisma.billboard.findMany({});

    const public_ids = billboardsToDelete.map((billboard) => {
        return getPublicIdFromUrl(billboard.imageUrl);
    });

    try {
        await cloudinary.v2.api.delete_resources(public_ids);
    } catch (e) {
        console.log(e);
    }

    console.timeEnd("🏙️Images deleted from Cloudinary...");

    console.time("🧹 Cleaned up the database...");

    await prisma.orderItem.deleteMany({ where: {} });
    await prisma.order.deleteMany({ where: {} });
    await prisma.product.deleteMany({ where: {} });
    await prisma.color.deleteMany({ where: {} });
    await prisma.category.deleteMany({ where: {} });
    await prisma.billboard.deleteMany({ where: {} });
    await prisma.store.deleteMany({ where: {} });

    console.timeEnd("🧹 Cleaned up the database...");

    //Create store
    const store = await prisma.store.create({
        data: {
            name: faker.lorem.word(),
            userId: process.env.SEED_USER_ID as string,
        },
    });

    let imageUrls: string[] = [];

    //Upload images to Cloudinary
    for (let i = 0; i < 2; i++) {
        const imageUrl = faker.image.url();

        try {
            const response = await cloudinary.v2.uploader.upload(imageUrl, {
                folder: "ecommerce-with-admin",
            });
            imageUrls.push(response.secure_url);
        } catch (e) {
            console.log(e);
        }
    }

    //Create billboards
    await prisma.billboard.createMany({
        data: [
            ...imageUrls.map((imageUrl) => {
                return {
                    storeId: store.id,
                    label: faker.lorem.lines({ min: 1, max: 1 }),
                    imageUrl,
                };
            }),
        ],
    });

    //Create categories
    const billboards = await prisma.billboard.findMany({});

    const categoryNames = ["Shirt", "Shoes", "Pants"];

    await prisma.category.createMany({
        data: [
            ...categoryNames.map((name) => {
                return {
                    name,
                    storeId: store.id,
                    billboardId: billboards[0].id,
                };
            }),
        ],
    });

    //Create color
    const colorTemplates = [
        { name: "Black", value: "#000000" },
        { name: "Salmon", value: "#FA8072" },
        { name: "Dark Purple", value: "#301934" },
        { name: "Midnight Blue", value: "#191970" },
        { name: "Dark Green", value: "#023020" },
    ];

    await prisma.color.createMany({
        data: [
            ...colorTemplates.map((color) => {
                return {
                    name: color.name,
                    value: color.value,
                    storeId: store.id,
                };
            }),
        ],
    });

    //Create products
    const categories = await prisma.category.findMany({});
    const colors = await prisma.color.findMany({});

    let productImageUrls = [];

    //Upload image to Cloudinary.
    for (let i = 0; i < 3; i++) {
        const imageUrl = faker.image.url();

        try {
            const response = await cloudinary.v2.uploader.upload(imageUrl, {
                folder: "ecommerce-with-admin",
            });

            productImageUrls.push(response.secure_url);
        } catch (e) {
            console.log(e);
        }
    }

    await prisma.product.create({
        data: {
            name: faker.lorem.word(),
            price: faker.number.int({ min: 10, max: 200 }),
            storeId: store.id,
            categoryId: categories[0].id,
            colorId: colors[0].id,
            images: {
                create: {
                    url: productImageUrls[0],
                },
            },
            sizes: {
                createMany: {
                    data: [
                        { name: "small", quantity: faker.number.int({ min: 1, max: 50 }) },
                        { name: "medium", quantity: faker.number.int({ min: 1, max: 50 }) },
                        { name: "large", quantity: faker.number.int({ min: 1, max: 50 }) },
                    ],
                },
            },
        },
    });

    await prisma.product.create({
        data: {
            name: faker.lorem.word(),
            price: faker.number.int({ min: 10, max: 200 }),
            storeId: store.id,
            categoryId: categories[0].id,
            colorId: colors[0].id,
            images: {
                create: {
                    url: productImageUrls[1],
                },
            },
            sizes: {
                createMany: {
                    data: [
                        { name: "medium", quantity: faker.number.int({ min: 1, max: 50 }) },
                        { name: "large", quantity: faker.number.int({ min: 1, max: 50 }) },
                    ],
                },
            },
        },
    });

    await prisma.product.create({
        data: {
            name: faker.lorem.word(),
            price: faker.number.int({ min: 10, max: 200 }),
            storeId: store.id,
            categoryId: categories[0].id,
            colorId: colors[0].id,
            images: {
                create: {
                    url: productImageUrls[2],
                },
            },
            sizes: {
                createMany: {
                    data: [{ name: "large", quantity: faker.number.int({ min: 1, max: 50 }) }],
                },
            },
        },
    });

    console.timeEnd(`🌱 Database has been seeded`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
