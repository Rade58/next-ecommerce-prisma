/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

interface PropsI {
  placeholder: boolean;
}

type paramsType = {
  page: string;
};

export const getServerSideProps: GetServerSideProps<PropsI, paramsType> =
  async (ctx) => {
    const { params } = ctx;

    params?.page; //

    return {
      props: {
        placeholder: true,
      },
    };
  };

const ProductPage: NP<PropsI> = (props) => {
  //

  console.log(props);

  return <div>🦉</div>;
};

export default ProductPage;
