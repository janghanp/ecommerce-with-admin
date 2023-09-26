"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/store";
import { Button } from "@/src/components/ui/button";

const CartButton = () => {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  const cartItems = useCart((state) => state.items);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-4">
      <Button variant="secondary" onClick={() => router.push("/cart")}>
        <ShoppingBag size={20} />
        <span className="ml-2 text-sm font-medium">{cartItems.length}</span>
      </Button>
    </div>
  );
};

export default CartButton;
