import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
});

module.exports = {
  openToastSuccess: (message) => {
    Toast.fire({
      icon: "success",
      title: message,
      background: "#e3f7df",
      iconColor: "#55c83e",
    });
  },

  openToastError: (message) => {
    Toast.fire({
      icon: "error",
      title: message,
      background: "#e3f7df",
      iconColor: "#55c83e",
    });
  },
  openToastWarning: (message) => {
    Toast.fire({
      icon: "warning",
      title: message,
      background: "#e3f7df",
      iconColor: "#55c83e",
    });
  },
  openToastInfo: (message) => {
    Toast.fire({
      icon: "info",
      title: message,
      background: "#e3f7df",
      iconColor: "#55c83e",
    });
  },
};
