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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
import { useRouter } from "next/navigation";
import { getConnectionPosts, getConnections } from "@/redux/feature/user/Connection/connectionAction";

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.authReducer)
  const { profile, status } = useSelector((state: RootState) => state.profileReducer)
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    try {
      if (user?.role == RoleEnum.USER) {
        dispatch(getProfile()).unwrap();
        dispatch(getConnections({ limit: 50 })).unwrap();
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
          <Box className={styles.profileBox} onClick={() => router.push('/user/profile')} >
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
              <Box className={styles.innerboxesBox}>
                <Box className={styles.outerbox}>
                  <Typography className={styles.title}>India's HNIs still upbeat on Dubai realty</Typography>
                  <Box className={styles.innerbox}>
                    <Typography className={styles.time}>{getLinkedInTime(Date.now() - (60 * 1000))}</Typography>
                    <Typography className={styles.reader}>2,343 Reader's</Typography>
                  </Box>
                </Box>
                <Box className={styles.outerbox}>
                  <Typography className={styles.title}>AI investment flows to a select few</Typography>
                  <Box className={styles.innerbox}>
                    <Typography className={styles.time}>{getLinkedInTime(Date.now() - (24 * 60 * 1000))}</Typography>
                    <Typography className={styles.reader}>223 Reader's</Typography>
                  </Box>
                </Box>
                <Box className={styles.outerbox}>
                  <Typography className={styles.title}>Indian firms go big on small AI models</Typography>
                  <Box className={styles.innerbox}>
                    <Typography className={styles.time}>{getLinkedInTime(Date.now() - (24 * 24 * 60 * 1000))}</Typography>
                    <Typography className={styles.reader}>753 Reader's</Typography>
                  </Box>
                </Box>
                <Box className={styles.outerbox}>
                  <Typography className={styles.title}>CEO pay growth slows across India Inc</Typography>
                  <Box className={styles.innerbox}>
                    <Typography className={styles.time}>{getLinkedInTime(Date.now() - (2 * 24 * 60 * 30 * 60 * 1000))}</Typography>
                    <Typography className={styles.reader}>753 Reader's</Typography>
                  </Box>
                </Box>
              </Box>
              <Box className={styles.showMore}>
                <Typography>Show more</Typography>
                <ExpandMoreIcon />
              </Box>
            </Box>
          </Box>

          <Box className={styles.newsBox}>
            <Typography className={styles.heading}>
              Today’s puzzles
            </Typography>

            <Box>
              <Box className={styles.item}>
                <Box className={styles.left}>
                  <Avatar src={"https://i.pravatar.cc/40?img=1"} className={styles.avatar} />
                  <Box>
                    <Typography className={styles.title}>
                      Patches #14
                    </Typography>
                    <Typography className={styles.subtitle}>
                      39 connections played
                    </Typography>
                  </Box>
                </Box>

                <ChevronRightIcon className={styles.icon} />
              </Box>
              <Box className={styles.item}>
                <Box className={styles.left}>
                  <Avatar src={"https://i.pravatar.cc/40?img=2"} className={styles.avatar} />
                  <Box>
                    <Typography className={styles.title}>
                      Zip #379
                    </Typography>
                    <Typography className={styles.subtitle}>
                      25 connections played
                    </Typography>
                  </Box>
                </Box>

                <ChevronRightIcon className={styles.icon} />
              </Box>
              <Box className={styles.item}>
                <Box className={styles.left}>
                  <Avatar src={"https://i.pravatar.cc/40?img=3"} className={styles.avatar} />
                  <Box>
                    <Typography className={styles.title}>
                      Mini Sudoku #323
                    </Typography>
                    <Typography className={styles.subtitle}>
                      The classic game, made mini
                    </Typography>
                  </Box>
                </Box>

                <ChevronRightIcon className={styles.icon} />
              </Box>
              <Box className={styles.item}>
                <Box className={styles.left}>
                  <Avatar src={"https://i.pravatar.cc/40?img=4"} className={styles.avatar} />
                  <Box>
                    <Typography className={styles.title}>
                      Tango #540
                    </Typography>
                    <Typography className={styles.subtitle}>
                      321 connections played
                    </Typography>
                  </Box>
                </Box>

                <ChevronRightIcon className={styles.icon} />
              </Box>
            </Box>

            <Box className={styles.showMore}>
              <Typography>Show more</Typography>
              <ExpandMoreIcon />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}