"use client";

import { useParams } from "next/navigation";
import ApiAlert from "@/src/components/api-alert";

interface Props {
    entityName: string;
    entityId: string;
}

const ApiList = ({ entityName, entityId }: Props) => {
    const params = useParams();

    const baseUrl = `${process.env.NEXT_PUBLIC_URL}/api/${params.storeId}`;

    return (
        <>
            <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`} />
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}/{${entityId}}`}
            />
            <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`} />
            <ApiAlert
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityId}}`}
            />
            <ApiAlert
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityId}}`}
            />
        </>
    );
};

export default ApiList;
