import { GetServerSideProps } from "next";
// import cache from "src/cache";

interface IProps {
  coupon: string | null;
}

export default function Home({ coupon }: IProps) {
  return (
    <div>
      {coupon ? (
        <h1>Your coupon is {coupon}</h1>
      ) : (
        <h1>Sorry... not seeing one</h1>
      )}
    </div>
  );
}

// https://api.purchasing-power-parity.com/?target=
