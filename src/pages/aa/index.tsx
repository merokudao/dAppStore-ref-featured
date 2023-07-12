import dynamic from "next/dynamic";
import { Suspense } from "react";

const Index = () => {
  const AADynamic = dynamic(
    () => import("../../components/aa/index").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AADynamic />
      </Suspense>
    </>
  );
};

export default Index;