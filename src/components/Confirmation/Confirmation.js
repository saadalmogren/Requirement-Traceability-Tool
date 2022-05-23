import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  redBtn: {
    color: "red",
  },
}));
export default function Confirmation(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    setOpen(false);
    props.onConfirm();
  };

  return (
    <div>
      <Tooltip title={props.tooltip ? props.tooltip : "Delete"}>
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title ? props.title : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.description ? props.description : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className={classes.redBtn} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
