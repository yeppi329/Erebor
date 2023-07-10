import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import Link from "@mui/material/Link";
import Modal from "./policy";

function Signup() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      policy: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("이름을 입력하세요."),
      email: Yup.string()
        .email("Invalid email address")
        .matches(/^[A-Za-z0-9._%+-]+@arbeon.com$/,"arbeon.com으로 가입해주세요.")
        .required("이메일을 입력하세요."),
      password: Yup.string().required("비밀번호를 입력하세요."),
      policy: Yup.boolean().oneOf([true], "약관에 동의해주세요"),
    }),
    onSubmit: (values) => {
      // Perform login logic here
      navigate("/");
    },
  });

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ my: 3, mt: 30 }}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ fontFamily: "KIMM_Bold" }}
          >
            회원가입
          </Typography>
          <Typography
            color="textSecondary"
            fontFamily="TheJamsil5Bold"
            gutterBottom
            variant="body2"
          >
            사내 메일로 회원가입해주세요.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
          }}
        >
          <TextField
            label="이름(회사 영어 이름)"
            id="name"
            name="name"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            label="회사 이메일"
            id="email"
            name="email"
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            label="비밀번호"
            id="password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              ml: -1,
            }}
          >
            <Checkbox
              checked={formik.values.policy}
              name="policy"
              onChange={formik.handleChange}
            />
            <Modal />
            <Typography color="textSecondary" variant="body2">
              (필수)
            </Typography>
          </Box>
          {Boolean(formik.touched.policy && formik.errors.policy) && (
            <FormHelperText error>{formik.errors.policy}</FormHelperText>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Sign Up Now
          </Button>
        </Box>
        <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
          이미 회원이라면?{" "}
          <Link href="/" variant="body2">
            로그인
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Signup;
