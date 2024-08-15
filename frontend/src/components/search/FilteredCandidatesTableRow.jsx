import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import {Button}  from '@mui/material';
function FilteredCandidatesTableRow(props) {
    return (
        <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
            <TableCell component="th" align="center">
            {props.coap}
            </TableCell>
            <TableCell component="th" align="center">
            {props.appno}
            </TableCell>
            <TableCell align="center">{props.category}</TableCell>
            <TableCell align="center">{props.gender}</TableCell>
            <TableCell align="center">{props.maxgatescore}</TableCell>
            <TableCell align="center">{props.ews}</TableCell>
            <TableCell align="center">{props.pwd}</TableCell>
            
            <TableCell align="center" >
                <Link to={`/search/${props.coap}`}>
                    <Button variant='contained'>update</Button>
                </Link>
            </TableCell>
            

      </TableRow>
    );
}

export default FilteredCandidatesTableRow;