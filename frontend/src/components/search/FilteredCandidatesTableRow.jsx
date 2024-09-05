import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
function FilteredCandidatesTableRow(props) {
    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" align="center" sx={{ fontFamily: 'Barlow,  sans serif', fontWeight: 600 }}>
                {props.coap}
            </TableCell>
            <TableCell component="th" align="center" sx={{ fontFamily: 'Barlow,  sans serif', fontWeight: 600 }}>
                {props.appno}
            </TableCell>
            <TableCell align="center" sx={{ fontFamily: 'Barlow,  sans serif', fontWeight: 600 }}>{props.category}</TableCell>
            <TableCell align="center" sx={{ fontFamily: 'Barlow,  sans serif', fontWeight: 600 }}>{props.gender}</TableCell>
            <TableCell align="center" sx={{ fontFamily: 'Barlow,  sans serif', fontWeight: 600 }}>{props.maxgatescore}</TableCell>
            <TableCell align="center" sx={{ fontFamily: 'Barlow,  sans serif', fontWeight: 600 }}>{props.ews}</TableCell>
            <TableCell align="center" sx={{ fontFamily: 'Barlow,  sans serif', fontWeight: 600 }}>{props.pwd}</TableCell>

            <TableCell align="center" >
                <Link to={`/search/${props.coap}`}>
                    <Button variant='contained'>update</Button>
                </Link>
            </TableCell>


        </TableRow>
    );
}

export default FilteredCandidatesTableRow;