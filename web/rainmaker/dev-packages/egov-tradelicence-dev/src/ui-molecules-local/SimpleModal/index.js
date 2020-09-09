import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class SimpleModal extends React.Component {
  render() {
    const {open, maxFileSizeMsg} = this.props;
    return (
      <div>
        {/* <Button onClick={this.handleClickOpen}>Open alert dialog</Button> */}
        <Dialog
          open={open}
          onClose={this.props.closeModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {maxFileSizeMsg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.closeModal} color="primary" autoFocus>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default SimpleModal;