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
import BusinessIcon from '@mui/icons-material/Business';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { RoleEnum } from "@/enums/user.role"

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
            route: "/user/profile",
            isLoginNeeded: true,
            roles: [RoleEnum.USER]
        },
        {
            label: "Update",
            icon: <SchoolIcon />,
            route: "/user/profile/form",
            isLoginNeeded: true,
            roles: [RoleEnum.USER]
        },
        {
            label: "Globe Professionals",
            icon: <RocketLaunchIcon />,
            route: "/user/connection/global",
            roles: [RoleEnum.USER]
        },
        {
            label: "Request",
            icon: <HandshakeIcon />,
            route: "/user/connection/request",
            roles: [RoleEnum.USER]
        },
        {
            label: "Network",
            icon: <Diversity3Icon />,
            route: "/user/connection/network",
            roles: [RoleEnum.USER]
        },
        {
            label: "Connections Posts",
            icon: <WorkIcon />,
            route: "/user/connection/post",
            roles: [RoleEnum.USER]
        },
        {
            label: "My Posts",
            icon: <ArticleIcon />,
            route: "/user/post",
            isLoginNeeded: true,
            roles: [RoleEnum.USER]
        },
        {
            label: "Create Post",
            icon: <PostAddIcon />,
            route: "/user/post/form",
            isLoginNeeded: true,
            roles: [RoleEnum.USER]
        },
        {
            label: "Company Info",
            icon: <BusinessIcon />,
            route: "/company/insight",
            isLoginNeeded: true,
            roles: [RoleEnum.COMPANY]
        },
        {
            label: "Company Edit",
            icon: <AddBusinessIcon />,
            route: "/company/insight/form",
            isLoginNeeded: true,
            roles: [RoleEnum.COMPANY]
        },
        {
            label: "job",
            icon: <WorkIcon />,
            route: "/company/job/",
            isLoginNeeded: true,
            roles: [RoleEnum.COMPANY]
        },
        {
            label: "Find job",
            icon: <WorkIcon />,
            route: "/user/job/global",
            isLoginNeeded: true,
            roles: [RoleEnum.USER]
        },
        {
            label: "Applied job",
            icon: <WorkIcon />,
            route: "/user/job",
            isLoginNeeded: true,
            roles: [RoleEnum.USER]
        },
    ];

    const visibleTabs = tabsConfig.filter(
        (tab) =>
            (!tab.isLoginNeeded || user) &&
            (!tab.roles || (user && tab.roles.includes(user.role)))
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
                        {visibleTabs.map((tab) => (
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