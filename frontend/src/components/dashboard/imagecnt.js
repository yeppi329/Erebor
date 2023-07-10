import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../title';
import { BaseUrlContext } from "../../index";


export default function Deposits() {
  const [data, setData] = useState([]);
  const BASE_URL = useContext(BaseUrlContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/data/total-count`
        );
        setData(response.data.total_count);
        console.log("imageName 데이터 가져오기 성공  response.data:", response.data);
        //response.data: {result: Array(3)}
        console.log(
          "imageName 데이터 가져오기 성공  response.data.total_count:",
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
      <Title>총 이미지 장수</Title>
      <Typography component="p" variant="h4">
        {data}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        2023 기준
      </Typography>
    </React.Fragment>
  );
}