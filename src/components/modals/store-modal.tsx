"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useModalState } from "@/src/store";
import Modal from "@/src/components/ui/modal";
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const subtmitHandler = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        //TODO: create store
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
                        <form onSubmit={form.handleSubmit(subtmitHandler)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="E-Commerce" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => storeModal.toggleModal(false)}
                                >
                                    Cancle
                                </Button>
                                <Button type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default StoreModal;
