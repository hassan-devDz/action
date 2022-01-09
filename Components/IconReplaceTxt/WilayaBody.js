import PlaceIcon from "@material-ui/icons/Place";
import Tooltip from "@material-ui/core/Tooltip";
const replaceWilaya = (rowData, parms) => {
  let name;
  if (rowData.wilaya.value === "مديرية التربية للجزائر وسط") {
    name = rowData.wilaya.value.replace(
      "مديرية التربية للجزائر وسط",
      "الجزائر و"
    );
    return (
      <>
        <Tooltip title={name} placement="top">
          <span style={{ display: "flex", gap: 12 }}>
            <PlaceIcon color="primary" />
            {name}
          </span>
        </Tooltip>
      </>
    );
  }
  if (rowData.wilaya.value === "مديرية التربية للجزائر غرب") {
    name = rowData.wilaya.value.replace(
      "مديرية التربية للجزائر غرب",
      "الجزائر غ"
    );
    return (
      <>
        <Tooltip title={name} placement="top">
          <span style={{ display: "flex", gap: 12 }}>
            <PlaceIcon color="primary" />
            {name}
          </span>
        </Tooltip>
      </>
    );
  }
  if (rowData.wilaya.value === "مديرية التربية للجزائر شرق") {
    name = rowData.wilaya.value.replace(
      "مديرية التربية للجزائر شرق",
      "الجزائر ش"
    );
    return (
      <>
        <Tooltip title={name} placement="top">
          <span style={{ display: "flex", gap: 12 }}>
            <PlaceIcon color="primary" />
            {name}
          </span>
        </Tooltip>
      </>
    );
  } else {
    name = rowData.wilaya.value.replace("مديرية التربية لولاية", "");
  }
  return (
    <>
      <Tooltip title={name} placement="top">
        <span style={{ display: "flex", gap: 12 }}>
          <PlaceIcon color="primary" />
          {name}
        </span>
      </Tooltip>
    </>
  );
};
export default replaceWilaya;
