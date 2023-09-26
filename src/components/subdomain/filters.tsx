import { Color } from "@prisma/client";
import CurrentFilters from "@/src/components/subdomain/current-filters";
import ColorFilter from "@/src/components/subdomain/color-filter";
import PriceFilter from "@/src/components/subdomain/price-filter";

interface Props {
  colors: Color[];
}

const Filters = ({ colors }: Props) => {
  return (
    <div className="hidden flex-col gap-y-10 lg:flex">
      <CurrentFilters />
      <ColorFilter colors={colors} />
      <PriceFilter />
    </div>
  );
};

export default Filters;
