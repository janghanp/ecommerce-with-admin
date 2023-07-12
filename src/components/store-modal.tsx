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

    const submitHandler = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            const response = await axios.post("/api/stores", values);

            toast.success("Store created!");

            window.location.assign(`/${response.data.id}`);
        } catch (error) {
            toast.error("Something went wrong.");
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
            <div>
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
                                                disabled={isLoading}
                                                placeholder="E-Commerce"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                    disabled={isLoading}
                                    type="button"
                                    variant="outline"
                                    onClick={() => storeModal.toggleModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={isLoading} type="submit">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default StoreModal;
