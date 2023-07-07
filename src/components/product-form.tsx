"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, Image, Category, Size, Color } from "@prisma/client";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import Heading from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import AlertModal from "@/src/components/alert-modal";
import ImageUpload from "@/src/components/image-upload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";

interface Props {
    initialData:
        | (Product & {
              images: Image[];
          })
        | null;

    categories: Category[];
    sizes: Size[];
    colors: Color[];
}

type ProductFormValue = z.infer<typeof formSchema>;

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array().min(1, { message: "Image is required" }),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

const ProductForm = ({ initialData, categories, colors, sizes }: Props) => {
    const params = useParams();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastMessage = initialData ? "Product updated!" : "Product created!";
    const action = initialData ? "Save changes" : "Create product";

    const form = useForm<ProductFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  price: parseFloat(String(initialData?.price)),
              }
            : {
                  name: "",
                  images: [],
                  categoryId: "",
                  price: 0,
                  colorId: "",
                  sizeId: "",
                  isFeatured: false,
                  isArchived: false,
              },
    });

    const onSubmit = async (data: ProductFormValue) => {
        try {
            setIsLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }

            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong...");
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

            router.refresh();
            router.push(`/${params.storeId}/products`);

            toast.success("Product deleted.");
        } catch (error) {
            toast.error("Something went wrong...");
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        disabled={isLoading}
                                        onChange={(url) =>
                                            field.onChange([...field.value, { url }])
                                        }
                                        onRemove={(url) =>
                                            field.onChange([
                                                ...field.value.filter(
                                                    (current) => current.url !== url
                                                ),
                                            ])
                                        }
                                        value={field.value.map((image) => image.url)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                            placeholder="Product Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="9.99"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
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
                                                    placeholder="Select a Category"
                                                ></SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
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
                                                    placeholder="Select a Size"
                                                ></SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
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
                                                    placeholder="Select a Color"
                                                ></SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem key={color.id} value={color.id}>
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            //@ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none ">
                                        <FormLabel>Featured</FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            //@ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none ">
                                        <FormLabel>Archived</FormLabel>
                                        <FormDescription>
                                            This product will not appear anywhere in the store.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default ProductForm;
