import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
//core
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ListItemIcon from "@material-ui/core/ListItemIcon";
//icons
import ChevronLeftTwoToneIcon from "@material-ui/icons/ChevronLeftTwoTone";
import ExpandMore from "@material-ui/icons/ExpandMore";

//local
import { list } from "./arrList";
import useStyles from "./sty";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
//import theme from "../them";

//code
// const useStyles = makeStyles({
//   root: { /* … */ },
//   label: { /* … */ },
//   outlined: {
//     /* … */
//     '&$disabled': { /* … */ },
//   },
//   outlinedPrimary: {
//     /* … */
//     '&:hover': { /* … */ },
//   },
//   disabled: {},
// }, { name: 'MuiButton' });
const NestedList = () => {
  const router = useRouter();
  const lists = list;
  const classes = useStyles();
  const [op, setOp] = useState("");
  const handleClick = (key) => {
    const val = !op[key];

    setOp((prevState) => {
      return { ...prevState, [key]: val };
    });
  };
  return (
    <div className={classes.root}>
      <List component="nav" className={classes.margn}>
        {lists.map(({ key, label, icon: Icon, items, link }) => {
          const open = op[key] || false;
          if (link) {
            return (
              <Paper elevation={4} key={key} className={classes.papercls}>
                <Link href={link}>
                  <a>
                    <ListItem
                      button
                      onClick={() => handleClick(key)}
                      className={
                        router.pathname == link
                          ? clsx(classes.pdli, classes.pdliActive)
                          : clsx(classes.pdli)
                      }
                    >
                      {console.log(op)}
                      <ListItemIcon>
                        <Icon className={classes.fontList} />
                      </ListItemIcon>
                      <ListItemText
                        primary={label}
                        style={{ color: "black" }}
                      />

                      {open && items.length != 0 ? (
                        <ExpandMore
                          className={items.length != 0 ? null : classes.visi}
                        />
                      ) : (
                        <ChevronLeftTwoToneIcon
                          className={items.length != 0 ? null : classes.visi}
                        />
                      )}
                    </ListItem>
                  </a>
                </Link>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {console.log(link)}
                    {items.map(
                      ({
                        key: childKey,
                        link: childlink,
                        label: childLabel,
                        icon: ChildIcon,
                      }) => (
                        <Link key={childKey} href={childlink}>
                          <a>
                            <ListItem button className={classes.nested}>
                              <ListItemIcon>
                                <ChildIcon />
                              </ListItemIcon>
                              <ListItemText primary={childLabel} />
                            </ListItem>
                          </a>
                        </Link>
                      )
                    )}
                  </List>
                </Collapse>
              </Paper>
            );
          } else
            return (
              <Paper elevation={4} key={key} className={classes.papercls}>
                <ListItem
                  button
                  onClick={() => handleClick(key)}
                  className={classes.pdli}
                >
                  <ListItemIcon>
                    <Icon className={classes.fontList} />
                  </ListItemIcon>
                  <ListItemText primary={label} style={{ color: "black" }} />

                  {open && items.length != 0 ? (
                    <ExpandMore
                      className={items.length != 0 ? "" : classes.visi}
                    />
                  ) : (
                    <ChevronLeftTwoToneIcon
                      className={items.length != 0 ? "" : classes.visi}
                    />
                  )}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {console.log(items)}
                    {items.map(
                      ({
                        key: childKey,
                        link: childlink,
                        label: childLabel,
                        icon: ChildIcon,
                      }) => (
                        <Link key={childKey} href={childlink}>
                          <a>
                            <ListItem button className={classes.nested}>
                              <ListItemIcon>
                                <ChildIcon />
                              </ListItemIcon>
                              <ListItemText primary={childLabel} />
                            </ListItem>
                          </a>
                        </Link>
                      )
                    )}
                  </List>
                </Collapse>
              </Paper>
            );
        })}
      </List>
    </div>
  );
};

export default NestedList;
