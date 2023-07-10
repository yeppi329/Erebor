import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
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
          `${BASE_URL}/api/data/count-by-classname`
        );
        setData(response.data.result);
        console.log("데이터 가져오기 성공  response.data:", response.data);
        //response.data: {result: Array(3)}
        console.log(
          "데이터 가져오기 성공  response.data.result:",
          response.data.total_count
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
      <Title>총 클래스 수</Title>
      <Typography component="p" variant="h4">
        {data}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        2023 기준
      </Typography>
    </React.Fragment>
  );
};

export default YourComponent;
