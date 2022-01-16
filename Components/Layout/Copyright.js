import Link from "../Ui/Link";

import Typography from "@material-ui/core/Typography";

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"جميع الحقوق محفوظة © "}
      <Link
        color="primary"
        href="https://www.education.gov.dz/"
        target="_blank"
      >
        وزارة التربية الوطنية
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
