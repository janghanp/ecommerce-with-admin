"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

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
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: Props) => {
  const params = useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    const trimmedData = {
      name: data.name.trim(),
    };

    if (trimmedData.name.includes(" ")) {
      form.setError("name", { message: "Store name can't have space between letters. " });
      return;
    }

    try {
      setIsLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, trimmedData);
      router.refresh();
      toast.success("Successfully updated!");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response!.data.includes("already in use")) {
          form.setError("name", { message: error.response!.data });
          return;
        }

        toast.error("Something went wrong...");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);

      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first.");
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
        <Heading title={"Settings"} description={"Manage store preferences"} />
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
                <FormLabel>Name (Sub domain)</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Store name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsForm;
