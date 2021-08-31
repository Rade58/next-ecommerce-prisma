/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { NextPage as NP } from "next";

const PageName: NP = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          marginTop: "380px",
          fontSize: "3em",
          color: "tomato",
        }}
      >
        👾 You are banned
      </h1>
    </div>
  );
};

export default PageName;
