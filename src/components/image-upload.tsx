"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/src/components/ui/button";

interface Props {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload = ({ disabled, onChange, onRemove, value }: Props) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onUpload = (result: any) => {
        console.log(result);
        //Response from Cloudinary when uploading an image.
        onChange(result.info.secure_url);
    };

    if (!isClient) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div
                        key={url}
                        className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
                    >
                        <div className="absolute right-2 top-2 z-10">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image fill className="object-cover" src={url} alt={"Image"} priority />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset={"gnzbfs3l"}>
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;
