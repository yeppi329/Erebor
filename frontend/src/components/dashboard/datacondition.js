import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { BaseUrlContext } from "../../index";
import Typography from '@mui/material/Typography';
import Title from '../title';

const YourComponent = () => {
  const [data, setData] = useState([]);
  const BASE_URL = useContext(BaseUrlContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/data/category-total-count`
        );
        // setData(response.data.categories);
        setData(response.data.categories)
        console.log("orders.js 데이터 가져오기 성공  response.data:", response.data);
        //response.data: {result: Array(3)}
        console.log(
          "orders.js 데이터 가져오기 성공  response.data.categories:",
          response.data.categories
        );
        //response.data.result: (3) [{…}, {…}, {…}]
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Title>데이터 현황</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Class Count</TableCell>
            <TableCell>Image Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.Category}>
              <TableCell>{row.Category}</TableCell>
              <TableCell>{row.DistinctClassCount}</TableCell>
              <TableCell>{row.ImageCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default YourComponent;