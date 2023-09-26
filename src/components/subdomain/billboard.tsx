import { Billboard as BillboardType } from "@prisma/client";

interface Props {
  billboard: BillboardType | null;
}

const Billboard = ({ billboard }: Props) => {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div
        style={{ backgroundImage: `url(${billboard?.imageUrl})` }}
        className={`relative aspect-square overflow-hidden rounded-xl bg-cover md:aspect-[2.4/1]`}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 text-center">
          <div className="max-w-xs text-3xl font-bold sm:max-w-xl sm:text-5xl lg:text-6xl">
            {billboard ? (
              billboard.label
            ) : (
              <div className="text-3xl text-muted-foreground">Please set up the store first.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Billboard;
