import React from 'react';
import brick from '../images/brick.png';
import smg from '../images/smg.png';
import ar from '../images/ar.png';


class Inventory extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const tableStyle= {
            border: '1px solid black',
            emptyCells: 'show',
        }

        const tableDataStyle= {
            border: '1px solid black',
            emptyCells: 'show',
            width: '100px',
            height: '100px',
        }

        return(
            <div style={{position: 'absolute', left: '0px', bottom: '0px'}}>
                <table style={tableStyle}>
					<tr>
						<td style={tableDataStyle} id="gun"><img src={brick} alt='brick' style={{width:'80px', height:'80px'}}/></td>
						<td style={tableDataStyle} id="brick"><img src={smg} alt='smg' style={{width:'80px', height:'80px'}}/></td>
					</tr>
				</table>
            </div>
        );
    }
}

export default Inventory;