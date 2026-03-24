"use client"

import styles from "./home.module.css"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useSelector } from "react-redux"

import {
  Avatar,
  Box,
  Button,
  Card,
  Typography
} from "@mui/material"
import { RoleEnum } from "@/enums/user.role";

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.authReducer)
  const router = useRouter()

  if (loading) {
    return <Box className={styles.container}>Loading...</Box>;
  }

  return (
    <Box className={styles.container}>
      <Card className={styles.cardWrapper} elevation={3}>
        Hey welcome to linkedin
      </Card>
    </Box>
  )
}