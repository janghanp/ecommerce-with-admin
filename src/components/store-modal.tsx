"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { useModalState } from "@/src/store";
import Modal from "@/src/components/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { AxiosError } from "axios";

const formSchema = z.object({
  name: z.string().min(1),
});

const StoreModal = () => {
  const storeModal = useModalState();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const submitHandler = async (data: z.infer<typeof formSchema>) => {
    const trimmedData = {
        name: data.name.trim(),
    };

    if (trimmedData.name.includes(" ")) {
        form.setError("name", { message: "Store name can't have space between letters. " });
        return;
    }

    try {
        setIsLoading(true);

        const response = await axios.post("/api/stores", trimmedData);

        toast.success("Store created!");

        window.location.href = `/${response.data.id}`;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error);

            if (error.response?.data.includes("already")) {
                form.setError("name", { message: error.response?.data });
            }
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Modal
      title={"Create Store"}
      description={"Add a new store to manage products and categories"}
      isOpen={storeModal.isOpen}
      onClose={() => {
        storeModal.toggleModal(false);
      }}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className={`${
                        form.formState.errors.name?.message &&
                        "&& border-red-500 focus-visible:ring-red-500"
                      }`}
                      disabled={isLoading}
                      placeholder="E-Commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-end space-x-2 pt-6">
              <Button disabled={isLoading} type="submit">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;
