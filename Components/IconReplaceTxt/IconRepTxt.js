import Tooltip from "@material-ui/core/Tooltip";
import SchoolTwoToneIcon from "@material-ui/icons/SchoolTwoTone";


/**--------------------ايقونة المدرسة في الجدول------------------------- */


const replaceStrIcon = (rowData, parms) => {
    const name = rowData.moassa.EtabNom.replace("المدرسة الابتدائية", "");
    return (
      <>
        <Tooltip title={name} placement="top">
          <span style={{ display: "flex", gap: 12 }}>
            <SchoolTwoToneIcon color="primary" />
            {name}
          </span>
        </Tooltip>
      </>
    );
  };
export default replaceStrIcon