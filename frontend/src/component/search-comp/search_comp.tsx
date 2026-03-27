"use client"
import { Box, TextField } from "@mui/material"
import { useState } from "react"
import styles from "./search_comp.module.css";
import SearchIcon from '@mui/icons-material/Search';
import { enqueueSnackbar } from "notistack";

type SearchCompProps = {
    onSearch: (value: string) => void;
};

export default function SearchComp({ onSearch }: SearchCompProps) {
    const [curr, setCurr] = useState<string>("");

    const handleSearch = () => {
        onSearch(curr);
    }

    return (
        <Box className={styles.search_box}>
            <SearchIcon />
            <TextField
                fullWidth
                placeholder="Search"
                value={curr}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onChange={(e) => setCurr(e.target.value)}
                sx={{
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        border: "transparent",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "transparent",
                    },
                }}
            />
        </Box>
    );
}