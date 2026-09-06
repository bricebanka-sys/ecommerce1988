import { useEffect, useState } from 'react';
import type { Order } from '../../app/models/order';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import agent from '../../app/api/agent';
import Spinner from '../../app/layout/Spinner';

export default function Orders() {

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {        
        agent.Orders.list()
            .then(orders => setOrders(orders))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner message="Loading orders..."/>

    // Function to convert order date to formatted string
    function formatDate(orderDate:unknown): string {
        // Cas 1 : le backend envoie une chaîne ISO-8601 (comportement par défaut de Spring Boot)
        if (typeof orderDate === 'string') {
          const parsed = new Date(orderDate);
          if (isNaN(parsed.getTime())) return "Invalid Date";
          const day = String(parsed.getDate()).padStart(2, '0');
          const month = String(parsed.getMonth() + 1).padStart(2, '0');
          const year = parsed.getFullYear();
          return `${day}-${month}-${year}`;
        }

        // Cas 2 : le backend envoie un tableau [année, mois, jour, ...] (Jackson configuré en mode timestamp)
        if (Array.isArray(orderDate) && orderDate.length >= 3) {
          const [year, month, day] = orderDate;
          return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
        }

        return "Invalid Date";
    
        const [year, month, day] = orderDate as number[];
        const formattedDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
        return formattedDate;
    }  

  return(

    <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Order Date</TableCell>
                        <TableCell align="right">Order Status</TableCell>              
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.map((order) => (
                        <TableRow
                            key={order.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {order.id}
                            </TableCell>
                            <TableCell align="right">{order.total}</TableCell>
                            <TableCell align="right">{formatDate(order.orderDate)}</TableCell>
                            <TableCell align="right">{order.orderStatus}</TableCell>                
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

  )
}