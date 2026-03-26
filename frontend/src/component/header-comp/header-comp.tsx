"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Button, Tabs, Tab, Avatar, Typography } from "@mui/material"
import { logoutUser } from "@/redux/feature/Auth/authAction"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { enqueueSnackbar } from "notistack"
import Image from "next/image"
import styles from "./headerComp.module.css"
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import PostAddIcon from "@mui/icons-material/PostAdd"
import ArticleIcon from "@mui/icons-material/Article"
import HandshakeIcon from '@mui/icons-material/Handshake';
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function HeaderComp() {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.authReducer)
    const { profile } = useSelector((state: RootState) => state.profileReducer)

    const tabsConfig = [
        {
            label: "Profile",
            icon: <Avatar sx={{ width: 20, height: 20 }} src={profile?.profile_img?.image_url || ""} />,
            route: "/profile",
            isLoginNeeded: true
        },
        { label: "Update", icon: <SchoolIcon />, route: "/profile/form", isLoginNeeded: true },
        { label: "Global", icon: <RocketLaunchIcon />, route: "/connection/global" },
        { label: "Request", icon: <HandshakeIcon />, route: "/connection/request" },
        { label: "Network", icon: <Diversity3Icon />, route: "/connection/network" },
        { label: "Connections Posts", icon: <WorkIcon />, route: "/connection/post" },
        { label: "My Posts", icon: <ArticleIcon />, route: "/post", isLoginNeeded: true },
        { label: "Create Post", icon: <PostAddIcon />, route: "/post/form", isLoginNeeded: true },
    ];
    const visibleTabs = tabsConfig.filter(
        (tab) => !tab.isLoginNeeded || user
    )
    const routes = visibleTabs.map(tab => tab.route)
    const [tabValue, setTabValue] = useState<number | false>(false)

    useEffect(() => {
        const index = routes.indexOf(pathname)
        if (index !== -1) {
            setTabValue(index)
        } else {
            setTabValue(false)
        }
    }, [pathname])

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
        router.push(routes[newValue])
    }

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            await signOut(auth)
            localStorage.clear()
            router.replace("/login")
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" })
            console.error(error)
        }
    }

    return (
        <Box className={styles.header}>
            <Box className={styles.leftContainer}>
                <Image
                    src={'/linkedin-logo.png'}
                    className={styles.avatar}
                    alt="logo"
                    width={100}
                    height={100}
                    onClick={() => router.replace('/')}
                />
            </Box>

            <Box className={styles.rightContainer}>
                <Box className={styles.category}>
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {visibleTabs.map((tab, index) => (
                            <Tab
                                key={tab.route}
                                icon={tab.icon}
                                label={
                                    <Typography className={styles.categoryText}>
                                        {tab.label}
                                    </Typography>
                                }
                                className={styles.categoryBoxes}
                            />
                        ))}
                    </Tabs>
                </Box>

                {user ? (
                    <Button
                        className={styles.logoutButton}
                        onClick={handleLogOut}
                    >
                        Log Out
                    </Button>
                ) : (
                    <Box className={styles.authButtons}>
                        <Button
                            onClick={() => router.replace('/login')}
                            className={styles.signinButton}
                        >
                            Sign In
                        </Button>
                        <Button
                            onClick={() => router.replace('/signup')}
                            className={styles.joinusButton}
                        >
                            Join now
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    )
}