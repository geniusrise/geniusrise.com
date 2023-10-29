/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "react-bulma-components"
import { Grid, Cell } from "styled-css-grid"

import { device, is4K } from "../../utils"
import logo from "../../assets/logo.png"
import styles from "./sidebar.module.css"
import { functions } from "../../config/navigation"

import dark from "../../themes/dark"
import light from "../../themes/light"
import darkBlue from "../../themes/darkBlue"
import purple from "../../themes/purple"

function useTheme(theme: number) {
  var t: any = darkBlue
  if (theme === 0) {
    t = darkBlue
  } else if (theme === 1) {
    t = light
  } else if (theme === 2) {
    t = dark
  } else if (theme === 3) {
    t = purple
  }

  for (const key in t) {
    // Update css variables in document's root element
    document.documentElement.style.setProperty(`--${key}`, t[key])
  }
}

const Sidebar = () => {
  const [theme, setTheme] = useState(3)
  useTheme(theme)

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src={logo} alt="logo"></img>
        </div>
        <Grid columns={device === "smartphone" ? 1 : 2}>
          {functions.map(d => {
            return (
              <Cell center middle>
                <Link className={styles.sidebarLink} to={d.link}>
                  {d.function_name}
                  {device === "smartphone" ? (
                    <></>
                  ) : device === "tablet" ? (
                    <></>
                  ) : device === "desktop" && is4K ? (
                    <div className={styles.sidebarLinkName}>{d.name}</div>
                  ) : (
                    <div className={styles.sidebarLinkName}>{d.name}</div>
                  )}
                </Link>
              </Cell>
            )
          })}
        </Grid>
      </div>
    </div>
  )
}

export default Sidebar
