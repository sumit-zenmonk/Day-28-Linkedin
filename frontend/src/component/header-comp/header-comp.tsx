"use client"

import { usePathname, useRouter } from "next/navigation"
import { Box, Button, Tabs, Tab, Avatar, Typography } from "@mui/material"
import { logoutUser } from "@/redux/feature/Auth/authAction"
import { AppDispatch, RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import "./header-comp.css"
import { useState, useEffect } from "react"
import { enqueueSnackbar } from "notistack"
import Image from "next/image"
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

export default function HeaderComp() {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const { user } = useSelector(
        (state: RootState) => state.authReducer
    )
    const [tabValue, setTabValue] = useState<number | false>(3);
    const routes = [
        // "/",
        "/profile",
        "/profile/form",
        "/connection/global",
        "/connection/request",
        "/connection/network",
    ]

    useEffect(() => {
        const index = routes.indexOf(pathname)
        if (index !== -1) {
            setTabValue(index)
        } else {
            setTabValue(false);
        }
    }, [pathname])

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
        router.push(routes[newValue])
    }

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            localStorage.clear()
            router.replace("/login")
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" })
            console.error(error)
        }
    }

    return (
        <Box className="header">
            <Box className="left-container">
                <Image
                    src={'/linkedin-logo.png'}
                    className="avatar"
                    alt="ok"
                    width={100}
                    height={100}
                    onClick={() => router.replace('/')}
                />
            </Box>

            {user ? (
                <Box className="right-container">
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {/* <Tab label="Home" /> */}
                        <Tab label="Profile" />
                        <Tab label="Update Profile" />
                        <Tab label="Global Professionals" />
                        <Tab label="Request" />
                        <Tab label="Network" />
                    </Tabs>

                    <Button
                        sx={{ color: "red", ml: 2 }}
                        onClick={handleLogOut}
                    >
                        Log Out
                    </Button>
                </Box>
            ) : (
                <Box className="right-container">
                    <Box className="category">
                        <Button className="categoryBoxes">
                            <RocketLaunchIcon />
                            <Typography className="categoryBoxes-Text">
                                Top Content
                            </Typography>
                        </Button>
                        <Button className="categoryBoxes">
                            <SchoolIcon />
                            <Typography className="categoryBoxes-Text">
                                Learning
                            </Typography>
                        </Button>
                        <Button className="categoryBoxes">
                            <WorkIcon />
                            <Typography className="categoryBoxes-Text">
                                Jobs
                            </Typography>
                        </Button>
                        <Button className="categoryBoxes">
                            <Diversity3Icon />
                            <Typography className="categoryBoxes-Text">
                                People
                            </Typography>
                        </Button>
                    </Box>

                    <Box className="authButtons">
                        <Button onClick={() => router.replace('/login')} className="signinButton">
                            Sign In
                        </Button>
                        <Button onClick={() => router.replace('/signup')} className="joinusButton">
                            Join now
                        </Button>
                    </Box>
                </Box>
            )}
        </Box >
    )
}