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
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { getProfile } from "@/redux/feature/Profile/profileAction";
import { getEducation } from "@/redux/feature/Education/educationAction";
import { getEmployment } from "@/redux/feature/Employment/employmentAction";
import { getConnectionRequests, getConnections, getNetworkConnections, getReceivedConnectionRequests } from "@/redux/feature/Connection/connectionAction";

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.authReducer)
  const router = useRouter()
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      dispatch(getProfile()).unwrap();
      dispatch(getEducation()).unwrap();
      dispatch(getEmployment()).unwrap();
      dispatch(getConnections({})).unwrap();
      dispatch(getNetworkConnections({}));
      dispatch(getReceivedConnectionRequests({}));
      dispatch(getConnectionRequests({}));
    } catch (error) {
      enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
      console.error(error)
    }
  }, [dispatch]);

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