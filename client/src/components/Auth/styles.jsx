import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    width: "540px",
    marginBottom: "20px",
    marginLeft: "80px",
    backgroundColor: "#9fc5e8",
    borderRadius: "0.7rem",
  },

  img1: {
    borderRadius: "0.7rem",
  },
  
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },

  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(10),
    height: theme.spacing(10),
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "40%",
    backgroundColor: "#1769aa",
    "&:hover": {
      backgroundColor: "#1769aa",
    },
  },

  customLogin: {
    width: "60%",
    backgroundColor: "#1769aa",
    "&:hover": {
      backgroundColor: "#1769aa",
    },
  },
  reg: {
    background: "#1769aa",
    borderRadius: "200px",
    width: "80%",
    padding: "4px",
    backgroundColor: "#1769aa",
  },

  googleButton: {
    marginBottom: theme.spacing(2),
  },

  switch: {},

  mainContainer: {
    backgroundColor: "#cfe2f3",
  },

  avt: {
    margin: theme.spacing(1),
    backgroundColor: "#1769aa",
    width: theme.spacing(7),
    height: theme.spacing(7),
  },

  grid: {
    marginTop: theme.spacing(9),
  },

  inline: {
    display: "inline",
  },

  list: {
    margin: theme.spacing(1.5),
    paddingLeft: "0px",
  },



  [theme.breakpoints.down(1400)]: {
    paper: {
      width: "90%",
      marginLeft: "20px",
    },
  },

  [theme.breakpoints.up(1400)]: {
    inline: {
      marginLeft: "30px",
    },
  },

  [theme.breakpoints.down(700)]: {
    paper: {
      marginLeft: "15px",
      width: "90%",
    },
  },
}));
