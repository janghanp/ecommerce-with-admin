"use client";

import Image from "next/image";
import { Tab } from "@headlessui/react";

import GalleryTab from "@/src/components/subdomain/gallery-tab";

interface Props {
    images: { id: string; url: string }[];
}

const Gallery = ({ images }: Props) => {
    return (
        <Tab.Group as="div" className="flex flex-col-reverse">
            <div className="mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                    {images.map((image) => (
                        <GalleryTab key={image.id} image={image} />
                    ))}
                </Tab.List>
            </div>
            <Tab.Panels className="aspect-square w-full">
                {images.map((image) => (
                    <Tab.Panel key={image.id}>
                        <div className="relative aspect-square h-full w-full overflow-hidden rounded-lg">
                            <Image
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                src={image.url}
                                alt="Image"
                                className="object-cover object-center"
                            />
                        </div>
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
};

export default Gallery;
