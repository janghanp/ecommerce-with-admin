import { prisma } from "@/src/lib/prisma";
import Heading from "@/src/components/heading";
import { Separator } from "@/src/components/ui/separator";
import Image from "next/image";
import { formatter } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { notFound } from "next/navigation";
import { Check, CircleDot } from "lucide-react";

interface Props {
    params: { orderId: string };
}

const OrderPage = async ({ params }: Props) => {
    const order = await prisma.order.findUnique({
        where: {
            id: params.orderId,
        },
        include: {
            orderItems: {
                include: {
                    product: {
                        include: {
                            images: true,
                        },
                    },
                },
            },
        },
    });

    if (!order) {
        return notFound();
    }

    const totalPrice = order.orderItems
        .map((orderItem) => Number(orderItem.product.price) * orderItem.quantity)
        .reduce((acc, curr) => {
            return acc + curr;
        }, 0);

    return (
        <div className="flex items-center justify-center p-2 md:p-8">
            <div className="flex w-full max-w-2xl flex-col items-start justify-center">
                <div className="flex items-center justify-between gap-x-5">
                    <Heading title={"Order"} description={"Order detail"} />
                    <Badge
                        variant="default"
                        className={`${
                            order.isPaid ? "bg-green-500" : "bg-red-500"
                        } !hover:bg-none flex items-center gap-x-1`}
                    >
                        {order.isPaid ? (
                            <>
                                <Check className="h-4 w-4" />
                                Paid
                            </>
                        ) : (
                            <>
                                <CircleDot className="h-4 w-4" />
                                Unpaid
                            </>
                        )}
                    </Badge>
                </div>
                <Separator className="my-5" />
                <div className="flex w-full flex-col gap-y-5">
                    <h2 className="text-xl font-semibold">Products</h2>
                    {order.orderItems.map((orderItem) => {
                        return (
                            <div key={orderItem.id}>
                                <div className="flex w-full items-center gap-x-5 rounded-md border p-3 shadow-sm">
                                    <div className="relative h-[100px] w-[100px] flex-none">
                                        <Image
                                            fill
                                            className="rounded-md"
                                            src={orderItem.product.images[0].url}
                                            alt="image"
                                        />
                                    </div>
                                    <div className="flex h-24 w-full items-end justify-between">
                                        <div className="flex flex-col gap-y-1">
                                            <span className="text-lg font-semibold">
                                                {orderItem.product.name}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                size: {orderItem.size}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                quantity: {orderItem.quantity}
                                            </span>
                                        </div>
                                        <div className="flex h-full flex-col justify-end gap-y-1">
                                            <span>
                                                {formatter.format(
                                                    Number(orderItem.product.price) *
                                                        orderItem.quantity
                                                )}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatter.format(Number(orderItem.product.price))}
                                                &nbsp; each
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="text-right text-xl font-semibold">
                        Total Price : &nbsp; {formatter.format(totalPrice)}
                    </div>
                    <Separator className="my-5" />
                    {/* This information should be provided after payment.*/}
                    <div className="flex flex-col gap-y-5">
                        <h2 className="text-xl font-semibold">Customer Information</h2>
                        <div>
                            <h3 className="mb-1 text-lg font-semibold">Phone</h3>
                            <span>0478686222</span>
                        </div>
                        <div>
                            <h3 className="mb-1 text-lg font-semibold">Address</h3>
                            <span>Somewhere</span>
                        </div>
                        <div>
                            <h3 className="mb-1 text-lg font-semibold">Payment Id (Stripe)</h3>
                            <span>askdjnfaljskdnfaklsjdnfkljn</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
