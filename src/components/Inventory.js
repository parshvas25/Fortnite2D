import React from 'react';
import brickImg from '../images/brick.png';
import smg from '../images/smg.png';
import ar from '../images/ar.png';


class Inventory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gun: null,
            brick: null,
        }
    }

    render(){
        const tableStyle= {
            border: '1px solid black',
            emptyCells: 'show',
            marginBottom: '0px'
        }

        const tableDataStyle= {
            border: '1px solid black',
            emptyCells: 'show',
            width: '100px',
            height: '100px',
        }

        var gun = null;
        var brick = null;
        if(this.props.inventory != null){
            if(this.props.inventory['gun'].bulletVelocity != ""){
                if(this.props.inventory['gun'].bulletVelocity == 30){
                    gun = <img src={smg} alt='smg' style={{width:'60px', height:'60px'}}/>;
                }
                else if(this.props.inventory['gun'].bulletVelocity == 50){
                    gun = <img src={ar} alt='ar' style={{width:'60px', height:'60px'}}/>;
                }
            }
    
            if(this.props.inventory['brick'] > 0){
                brick = <img src={brickImg} alt='brick' style={{width:'60px', height:'60px'}}/>;
            }
        }

        return(
            <div style={{position: 'absolute', left: '0px', bottom: '0px'}}>
                <table style={tableStyle}>
                    <tbody>
                        <tr style={tableStyle}>
                            <td style={tableDataStyle} id="gun">{gun}</td>
                            <td style={tableDataStyle} id="brick">{brick}</td>
                        </tr>
                    </tbody>
				</table>
            </div>
        );
    }
}

export default Inventory;