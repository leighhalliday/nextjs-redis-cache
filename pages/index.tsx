import { GetServerSideProps } from "next";
import cache from "src/cache";

interface IProps {
  coupon: string | null;
  name: string;
}

export default function Home({ coupon, name }: IProps) {
  return (
    <div>
      {coupon ? (
        <h1>Your coupon is {coupon}</h1>
      ) : (
        <h1>Sorry... not seeing one</h1>
      )}
      <p>{name} thanks for stopping by.</p>
    </div>
  );
}

interface IPPPData {
  ppp: {
    pppConversionFactor: number;
  };
}

export const getServerSideProps: GetServerSideProps = async () => {
  const country = "CO";

  const fetcher = async () => {
    const url = `https://api.purchasing-power-parity.com/?target=${country}`;
    const response = await fetch(url);
    const data: IPPPData = await response.json();

    let coupon: string | null = null;
    if (data.ppp.pppConversionFactor < 0.25) {
      coupon = "PPP75";
    } else if (data.ppp.pppConversionFactor < 0.5) {
      coupon = "PPP50";
    } else if (data.ppp.pppConversionFactor < 0.75) {
      coupon = "PPP25";
    }

    return coupon;
  };

  const name = await cache.fetch("name", () => "Leigh", 60 * 60 * 24);
  const cachedCoupon = await cache.fetch(`ppp:${country}`, fetcher, 60 * 60);

  return { props: { coupon: cachedCoupon, name } };
};
