import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  makeStyles,
  TextField,
  Tooltip,
} from "@material-ui/core";
import React from "react";
const useStyles = makeStyles((theme) => ({
  redBtn: {
    color: "red",
  },
}));
export default function RejectForm(props) {
  const [open, setOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");
  const classes = useStyles();

  const handleRejectInput = (event) => {
    setRejectReason(event.target.value);
  };

  const handleClickOpen = (param) => {
    setOpen(true);
    props.onClick(props.request);
  };

  const handleClose = () => {
    setOpen(false);
    setRejectReason("");
  };
  const handleConfirm = () => {
    setOpen(false);
    props.onConfirm(rejectReason);
    setRejectReason("");
  };

  return (
    <div>
      <Tooltip title="Reject">
        <IconButton
          variant={props.variant ? props.variant : "outlined"}
          color={props.color ? props.color : "primary"}
          onClick={handleClickOpen}
        >
          {props.children ? props.children : ""}
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Reject Confirmation!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Are you sure you want to reject "}{" "}
            <strong> {props.request.title}</strong> {"?"}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reject Reason"
            value={rejectReason}
            onChange={handleRejectInput}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className={classes.redBtn}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
