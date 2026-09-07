import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { User } from "../../app/models/user";
import type { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import axios from "axios";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";


// Interface définissant l'état du slice Account
export interface AccountState {
    user: User | null;
    error: string | null;
}

// État initial de l'authentification
const initialState: AccountState = {
    user: null,
    error: null
};


export const signInUser = createAsyncThunk<User, FieldValues>(
    'auth/login', // Identifiant de l'action Redux
    async (data, thunkAPI) => {
        try {
            // 1. Appel d'API à l'endpoint de connexion
            const user = await agent.Account.login(data);

            // 2. Stockage de la session utilisateur / JWT dans le localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // 3. Retour des données utilisateur (payload du cas fulfilled)
            return user;
        } catch (error: unknown) {
          // 🔧 Vérification explicite du type avant d'accéder à .data
          if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue({ error: error.response?.data });
          }
            // 4. Renvoi du message d'erreur d'API vers le reducer (cas rejected)
            return thunkAPI.rejectWithValue({ error: 'An unexpected error has occurred.' });
        }
    }
);

export const fetchCurrentUser = createAsyncThunk<User | null>(
    'auth/fetchCurrentUser',
    async (_, _thunkAPI) => {
        try {
            // 1. Récupération de la chaîne JSON depuis le localStorage
            const userString = localStorage.getItem('user');

            if (userString) {
                // 2. Conversion de la chaîne JSON en objet User typé
                const user: User = JSON.parse(userString);
                return user;
            }

            return null;
        } catch (error: unknown) {
            console.error('Error while fetching the current user:', error);
            return null;
        }
    }
);


export const logoutUser = createAsyncThunk<void>(
    'auth/logout',
    async (_, _thunkAPI) => {
        try {
            // Suppression du jeton / utilisateur du stockage local
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error while logging out the user:', error);
        }
    }
);


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        // Reducer synchrone 1 : Déconnexion explicite et nettoyage
        logout: (state) => {
            state.user = null;
            state.error = null;
            localStorage.removeItem('user');
            router.navigate('/'); // Redirection vers la page de connexion après la déconnexion
        },
        // Reducer synchrone 2 : Réinitialisation des erreurs dans le State
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // --- CAS 1 : SUCCÈS (fulfilled) ---
        // Matcher regroupant 'signInUser.fulfilled', 'fetchCurrentUser.fulfilled' et 'logoutUser.fulfilled'
        builder.addMatcher(
            isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
            (state, action) => {
                state.user = action.payload;
                state.error = null;
                toast.success('Sign in successful!');
            }
        );

        // --- CAS 2 : ÉCHEC (rejected) ---
        // Matcher déclenché lorsqu'une action d'authentification échoue
        builder.addMatcher(
            isAnyOf(signInUser.rejected, fetchCurrentUser.rejected, logoutUser.fulfilled),
            (state, action) => {
                const payload = action.payload as string | null;
                state.error = payload;
                toast.error(payload || 'Sign in failed. Please try again.');
            }
        );
    }
});

// Exportation des actions synchrones
export const { logout, clearError } = accountSlice.actions;

// Exportation du réducteur principal pour le Store Redux
// export default accountSlice.reducer;