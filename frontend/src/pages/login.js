import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import Link from "@mui/material/Link";

function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
      .email("Invalid email address")
      .matches(/^[A-Za-z0-9._%+-]+@arbeon.com$/,"arbeon.com으로 로그인해주세요.")
      .required("이메일을 입력하세요."),
      password: Yup.string().required("비밀번호를 입력하세요."),
    }),
    onSubmit: (values) => {
      // Perform login logic here
      navigate("/dashboard");
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
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'KIMM_Bold' }}>
            로그인
          </Typography>
          <Typography color="textSecondary" fontFamily= "TheJamsil5Bold"gutterBottom variant="body2" >
            사내 메일로 로그인해주세요.
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
            label="Email"
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
            label="Password"
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
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            로그인
          </Button>
        </Box>
        <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
          계정이 없다면?{" "}
          <Link href="/register" variant="body2">
            회원가입
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Login;
