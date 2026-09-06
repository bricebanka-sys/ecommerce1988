import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/lab/LoadingButton";
import { logout } from "../../features/account/accountSlice";
import { Link } from "react-router-dom";


export default function SignedInMenu(){

    const dispatch = useAppDispatch();
    // 1. Récupération des données de l'utilisateur connecté depuis Redux
    const { user } = useAppSelector((state) => state.account);

      // 2. Gestion de l'état d'ouverture/fermeture du menu déroulant MUI
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    // Ouverture du menu lors du clic sur le bouton
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Fermeture du menu
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            <Button
                onClick={handleClick}
                color='inherit'
                sx={{typography: 'h6'}}
            >
                Hi, {user?.username}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem component={Link as React.ElementType} to="/orders">My Orders</MenuItem>
                <MenuItem onClick={()=>dispatch(logout())}>Logout</MenuItem>
            </Menu>
        </>
    );
}