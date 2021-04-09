import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class Menu extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log('Menu called');
        return(
            <div>
                <Modal
                    // onHide={handleClose}
                    show={true}
                    style={{
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 5,
                        height: 150,
                        width: 500,
                        backgroundColor: 'white',
                        disableAutoFocus: true
                    }}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                    >
                        <Modal.Title>Quit Menu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                    >
                        Are you sure you want to quit the game? All progress will be lost
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                    >
                        <Button onClick={this.props.close} variant="secondary">
                            Close
                        </Button>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <Button onClick={this.props.quit} variant="primary">Quit</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Menu;