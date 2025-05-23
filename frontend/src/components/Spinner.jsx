import { ClipLoader } from "react-spinners";

// we can use this to override the default styles of the spinner
// putting styles in a variable
const override = {
  display: "block",
  margin: "100px auto",
};

const Spinner = ({ loading }) => {
  return (
    <ClipLoader
      color="#4338CA"
      loading={loading}
      cssOverride={override} // to add custom styles
      size={150}
    />
  );
};

export default Spinner;
