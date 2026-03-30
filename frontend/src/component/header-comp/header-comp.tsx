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
import WorkIcon from '@mui/icons-material/Work'
import ArticleIcon from "@mui/icons-material/Article"
import BusinessIcon from '@mui/icons-material/Business'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import AppsIcon from '@mui/icons-material/Apps'
import BadgeIcon from '@mui/icons-material/Badge'
import ChatIcon from '@mui/icons-material/Chat'
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { RoleEnum } from "@/enums/user.role"
import SearchComp from "../search-comp/search_comp"

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
            label: "Global Professionals",
            icon: <RocketLaunchIcon />,
            route: "/user/connection/global",
            roles: [RoleEnum.USER]
        },
        {
            label: "Network",
            icon: <Diversity3Icon />,
            route: "/user/connection/network",
            roles: [RoleEnum.USER]
        },
        {
            label: "Posts",
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
            label: "Company",
            icon: <BusinessIcon />,
            route: "/company/insight",
            isLoginNeeded: true,
            roles: [RoleEnum.COMPANY]
        },
        {
            label: "Edit",
            icon: <AddBusinessIcon />,
            route: "/company/insight/form",
            isLoginNeeded: true,
            roles: [RoleEnum.COMPANY]
        },
        {
            label: "Jobs",
            icon: <WorkIcon />,
            route: "/company/job",
            isLoginNeeded: true,
            roles: [RoleEnum.COMPANY]
        },
        {
            label: "Applicants",
            icon: <AppsIcon />,
            route: "/company/application",
            isLoginNeeded: true,
            roles: [RoleEnum.COMPANY]
        },
        {
            label: "Employees",
            icon: <BadgeIcon />,
            route: "/company/employee",
            isLoginNeeded: true,
            roles: [RoleEnum.COMPANY]
        },
        {
            label: "Jobs",
            icon: <WorkIcon />,
            route: "/user/job",
            isLoginNeeded: true,
            roles: [RoleEnum.USER]
        },
        {
            label: "Messaging",
            icon: <ChatIcon />,
            route: "/user/chat",
            isLoginNeeded: true,
            roles: [RoleEnum.USER]
        },
    ]

    const visibleTabs = tabsConfig.filter(
        (tab) =>
            (!tab.isLoginNeeded || user) &&
            (!tab.roles || (user && tab.roles.includes(user.role)))
    )

    const routes = visibleTabs.map(tab => tab.route)
    const [tabValue, setTabValue] = useState<number | false>(false)

    useEffect(() => {
        const index = routes.indexOf(pathname)
        setTabValue(index !== -1 ? index : false)
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
                    src={'/linkedin.png'}
                    className={styles.avatar}
                    alt="logo"
                    width={40}
                    height={40}
                    onClick={() => router.replace('/')}
                />
                {user && <SearchComp onSearch={(value) => enqueueSnackbar(value, { variant: "info" })} />}
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
                                iconPosition="top"
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