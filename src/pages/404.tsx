import { Link } from "../components/Link";
import { Heading } from "../components/Heading";

const NotFoundPage = () => {
  return (
    <>
      <Heading.h1>404</Heading.h1>
      <br />
      This page could not be found.
      <br />
      <br />
      <Link href="/">Go back home</Link>
    </>
  );
};

export default NotFoundPage;
