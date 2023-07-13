"use client";

import { useState } from "react";
import { Loader2, Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import Heading from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import AlertModal from "@/src/components/alert-modal";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/src/components/ui/select";

interface Props {
    initialData: Category | null;
    billboards: Billboard[];
}

type CategoryFormValue = z.infer<typeof formSchema>;

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});

const CategoryForm = ({ initialData, billboards }: Props) => {
    const params = useParams();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const title = initialData ? "Edit category" : "Create category";
    const description = initialData ? "Edit a category" : "Add a new category";
    const toastMessage = initialData ? "Category updated!" : "Category created!";
    const action = initialData ? "Save changes" : "Create category";

    const form = useForm<CategoryFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || { name: "", billboardId: "" },
    });

    const onSubmit = async (data: CategoryFormValue) => {
        try {
            setIsLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data);
            }

            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong...");
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);

            router.refresh();
            router.push(`/${params.storeId}/categories`);

            toast.success("Category deleted.");
        } catch (error) {
            toast.error("Make sure you removed all products using this category first.");
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={onDelete}
                isLoading={isLoading}
            />
            <div className={"flex items-center justify-between"}>
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                            setIsOpen(true);
                        }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Category name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a billboard"
                                                ></SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} type="submit">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default CategoryForm;
