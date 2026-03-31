"use client"

import styles from "./home.module.css"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GroupsIcon from '@mui/icons-material/Groups';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EventIcon from '@mui/icons-material/Event';

import {
  Avatar,
  Box,
  Typography
} from "@mui/material"
import { RoleEnum } from "@/enums/user.role";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { getProfile } from "@/redux/feature/user/Profile/profileAction";
import { getInsight } from "@/redux/feature/company/insight/insightAction";
import { getCompanyEmployees } from "@/redux/feature/company/employee/employeeAction";
import ConnectionPostComp from "@/component/user-comp/connection-post-comp/connection-post-comp";
import PostFormPage from "@/component/user-comp/post-form-comp/post-form-comp";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { getLinkedInTime } from "@/util/post.time";

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.authReducer)
  const { profile, status } = useSelector((state: RootState) => state.profileReducer)
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      if (user?.role == RoleEnum.USER) {
        dispatch(getProfile()).unwrap();
      } else if (user?.role == RoleEnum.COMPANY) {
        dispatch(getInsight()).unwrap();
        dispatch(getCompanyEmployees({}));
      }
    } catch (error) {
      enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
      console.error(error)
    }
  }, []);

  if (loading) {
    return <Box className={styles.container}>Loading...</Box>;
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.layout}>
        <Box className={styles.leftSidebar}>
          <Box className={styles.profileBox}>
            <Box className={styles.banner} />
            <Avatar
              src={profile?.profile_img?.image_url || ""}
              className={styles.profileAvatar}
            />
            <Typography className={styles.profilename}>
              {user?.name}
              <VerifiedUserIcon />
            </Typography>
            <Typography className={styles.profilebio}>
              {profile?.bio || "No bio"}
            </Typography>
            <Typography className={styles.profilenumber}>
              {profile?.mobile_number || "No number"}
            </Typography>
          </Box>

          <Box className={styles.careerBox}>
            <Typography>Achieve your career goals</Typography>
            <Typography>
              <WorkspacePremiumIcon /> Try Premium for ₹0
            </Typography>
          </Box>

          <Box className={styles.profileImpressionViewerBox}>
            <Box>
              <Typography>
                Profile Viewers
              </Typography>
              <Typography sx={{ color: "rgb(0, 121, 219)" }}>
                {profile?.count || 5}
              </Typography>
            </Box>
            <Box>
              <Typography>
                Profile Impressions
              </Typography>
              <Typography sx={{ color: "rgb(0, 121, 219)" }}>
                {profile?.impressions || 125}
              </Typography>
            </Box>
          </Box>

          <Box className={styles.profileEventBoxes}>
            <Box><BookmarkIcon />Saved Items</Box>
            <Box><GroupsIcon />Groups</Box>
            <Box><NewspaperIcon />Newsletters</Box>
            <Box><EventIcon />Events</Box>
          </Box>
        </Box>

        <Box className={styles.middleSidebar}>
          <PostFormPage />
          <ConnectionPostComp />
        </Box>

        <Box className={styles.rightSidebar}>
          <Box className={styles.newsBox}>
            <Box className={styles.newsTitle}>
              <Typography>LinkedIn News</Typography>
              <InfoOutlineIcon />
            </Box>

            <Box className={styles.newsinnerbox}>
              <Typography className={styles.heading}>Stories</Typography>
              <Box>
                <Typography className={styles.title}>India's HNIs still upbeat on Dubai realty</Typography>
                <Box>
                  <Typography>{getLinkedInTime(Date.now() - (60 * 1000))}</Typography>
                  <Typography>2,343 Reader's</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}