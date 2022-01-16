import React, { useState, useCallback, Fragment } from "react";
import ConfirmContext from "./ConfirmContext";
import ConfirmationDialog from "./ConfirmationDialogFormik";

const DEFAULT_OPTIONS = {
  INITIAL_FORM_STATE: {},
  FORM_VALIDATION: {},

  title: "هل أنت متأكد",
  description: "",
  content: null,
  confirmationText: "تأكيد",
  cancellationText: "تراجع",
  dialogProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
};

const buildOptions = (defaultOptions, options) => {
  const dialogProps = {
    ...(defaultOptions.dialogProps || DEFAULT_OPTIONS.dialogProps),
    ...(options.dialogProps || {}),
  };
  const confirmationButtonProps = {
    ...(defaultOptions.confirmationButtonProps ||
      DEFAULT_OPTIONS.confirmationButtonProps),
    ...(options.confirmationButtonProps || {}),
  };
  const cancellationButtonProps = {
    ...(defaultOptions.cancellationButtonProps ||
      DEFAULT_OPTIONS.cancellationButtonProps),
    ...(options.cancellationButtonProps || {}),
  };

  return {
    ...DEFAULT_OPTIONS,
    ...defaultOptions,
    ...options,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
  };
};

const ConfirmProviderFormik = ({ children, defaultOptions = {} }) => {
  const [options, setOptions] = useState({
    ...DEFAULT_OPTIONS,
    ...defaultOptions,
  });
  const [resolveReject, setResolveReject] = useState([]);
  const [resolve, reject] = resolveReject;

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      setOptions(buildOptions(defaultOptions, options));
      setResolveReject([resolve, reject]);
    });
  }, []);

  const handleClose = useCallback(() => {
    setResolveReject([]);
  }, []);

  const handleCancel = useCallback(() => {
    if (reject) {
      reject();
      handleClose();
    }
  }, [reject, handleClose]);

  const handelSubmit = useCallback(() => {
    if (resolve) {
      resolve();
      handleClose();
    }
  }, [resolve, handleClose]);
  const handleConfirm = useCallback(() => {
    if (resolve) {
      resolve();
      handleClose();
    }
  }, [resolve, handleClose]);

  return (
    <Fragment>
      <ConfirmContext.Provider value={confirm}>
        {children}
      </ConfirmContext.Provider>
      <ConfirmationDialog
        open={resolveReject.length === 2}
        options={options}
        onClose={handleClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onSubmit={handelSubmit}
      />
    </Fragment>
  );
};

export default ConfirmProviderFormik;
