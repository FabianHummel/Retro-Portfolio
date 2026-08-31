import { type Auth0Client, createAuth0Client, type User } from "@auth0/auth0-spa-js";
import type { Accessor } from "solid-js";
import { createContext, createSignal, onMount, type ParentProps } from "solid-js";

interface AuthContextType {
    isAuthenticated: Accessor<boolean>;
    user: Accessor<User | undefined>;
    loading: Accessor<boolean>;
    login: () => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: ParentProps) {
    const [auth0, setAuth0] = createSignal<Auth0Client | null>(null);
    const [isAuthenticated, setIsAuthenticated] = createSignal(false);
    const [user, setUser] = createSignal<User | undefined>(undefined);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        const client = await createAuth0Client({
            domain: "dev-dtxn0rxw80m0nte0.us.auth0.com",
            clientId: "8VWMqhjdyiCjABJlFP8l1Lez0nZvau0J",
            authorizationParams: {
                redirect_uri: window.location.origin,
            },
            useRefreshTokens: true,
            cacheLocation: "localstorage",
        });

        setAuth0(client);

        // Callback nach dem GitHub-Login verarbeiten
        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
            await client.handleRedirectCallback();
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const authed = await client.isAuthenticated();
        setIsAuthenticated(authed);

        if (authed) {
            const userData = await client.getUser();
            setUser(userData);
        }

        setLoading(false);
    });

    const login = async () => {
        const client = auth0();
        if (client) {
            await client.loginWithRedirect();
        }
    };

    const logout = () => {
        const client = auth0();
        if (client) {
            client.logout({ logoutParams: { returnTo: window.location.origin } });
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
}
