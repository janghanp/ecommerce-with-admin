import { CreditCard, DollarSign, Package } from "lucide-react";

import Heading from "@/src/components/heading";
import { Separator } from "@/src/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { formatter } from "@/src/lib/utils";
import { getTotalRevenue } from "@/src/fetchers/get-total-revenue";
import { getSalesCount } from "@/src/fetchers/get-sales-count";
import Overview from "@/src/components/overview";
import { getGraphRevenue } from "@/src/fetchers/get-graph-revenue";
import { getProductsCount } from "@/src/fetchers/get-products-count";

interface Props {
    params: { storeId: string };
}

const DashboardPage = async ({ params }: Props) => {
    const totalRevenue = await getTotalRevenue(params.storeId);
    const salesCount = await getSalesCount(params.storeId);
    const productsCount = await getProductsCount(params.storeId);
    const graphRevenue = await getGraphRevenue(params.storeId);

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-2 pt-10 md:p-8">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator />
                <div className="flex flex-col gap-x-0 gap-y-5 md:flex-row md:gap-x-5 md:gap-y-0">
                    <Card className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{salesCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{productsCount}</div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview graphRevenue={graphRevenue} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
