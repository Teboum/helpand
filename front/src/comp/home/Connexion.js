import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "react-router-dom/Link";
import Grid from "@material-ui/core/Grid";
import CancelIcon from "@material-ui/icons/Cancel";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { login } from "../../Action/LoginAction";

import { useHistory } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        eBoum
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Connexion({ helper }) {
  const history = useHistory();

  const classes = useStyles();
  const { register, handleSubmit, errors, watch } = useForm();
  const [token, setToken] = useState(false);
  const [error, setError] = useState(null);
  const [disable, setDisable] = useState(false);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get("auth")
      .then(async ({ data }) => {
        await setToken(data.token);
      })
      .catch((err) => console.log(err));
    return () => {};
  }, []);
  const onSubmit = (data) => {
    setDisable(true);
    console.log(data);
    data._csrf = token;
    axios
      .post("/auth/login" + (helper ? "?helper='helper'" : ""), data)
      .then(async ({ response, data }) => {
        setDisable(false);
        console.log(data);
        setDisable(false);
        if (data && data.success) {
          setDisable(false);
          await dispatch(login(data.userInfo));
          history.push("/");
        } else {
          setDisable(false);
          setError(response.data);
        }
      })
      .catch((err) => {
        setDisable(false);
        console.log(err);
      });
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        position: "relative",
        backgroundColor: "rgba(54, 192, 237, 0.5)",
        borderRadius: "20px",
      }}
    >
      <Link to="/">
        <CancelIcon
          style={{
            fontSize: "3.2rem",
            display: "inline-block",
            color: "white",
            position: "absolute",
            top: "5%",
            right: "5%",
            zIndex: "101",
          }}
        />
      </Link>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={register()}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register()}
          />
          <FormControlLabel
            inputRef={register()}
            name="remember"
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <br />
          <span
            style={{
              position: "absolute",
              textAlign: "center",
              left: " 50%",
              transform: "translate(-50%, -50%)",
              fontSize: "20px",
              fontWeight: "bold",
              width: "max-content",
              color: "red",
            }}
          >
            {error && error.message}
          </span>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            inputRef={register()}
            disabled={disable}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Connexion;
