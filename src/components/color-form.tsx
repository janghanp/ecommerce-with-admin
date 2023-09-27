"use client";

import { useState } from "react";
import { Loader2, Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
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
import { useAuth } from "@clerk/nextjs";

interface Props {
  initialData: Color | null;
}

type ColorFormValue = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "String must be a valid hex code",
  }),
});

const ColorForm = ({ initialData }: Props) => {
  const params = useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const toastMessage = initialData ? "Color updated!" : "Color created!";
  const action = initialData ? "Save changes" : "Create Color";

  const form = useForm<ColorFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", value: "" },
  });

  const onSubmit = async (data: ColorFormValue) => {
    try {
      setIsLoading(true);

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);

      router.refresh();
      router.push(`/${params.storeId}/colors`);

      toast.success("Color deleted.");
    } catch (error) {
      toast.error("Make sure you removed all products using this color first.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-start justify-center">
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <div className={"flex w-full items-center justify-between"}>
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
      <Separator className="my-5" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-lg flex-col items-start justify-center space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full max-w-md">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Color name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-full max-w-md">
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Color value (e.g #000000, #FFFFFF)"
                    {...field}
                  />
                </FormControl>
                <div
                  className="w-5 rounded-full border p-4"
                  style={{ backgroundColor: field.value }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ColorForm;
