import React from "react";
import { useRouter } from "next/router";
const error = () => {
  const querError = useRouter().query.error;
  console.log(querError);
  return <div>{querError} </div>;
};

export default error;
