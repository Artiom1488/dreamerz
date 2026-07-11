
import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

import type { ErrorResponseShape, TokenPair } from "./request-types";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

type RetriableConfig = {
    _retry?: boolean;
    url?: string;
    headers?: Record<string, string>;
};

const notify = (message: string): void => {
    toast.warning(message);
};

const resolveErrorMessage = (data: unknown): string => {
    const fallback = "Something went wrong";

    if (!data || typeof data !== "object") {
        return fallback;
    }

    const parsed = data as ErrorResponseShape;
    if (typeof parsed.exception === "string") {
        return parsed.exception;
    }

    if (
        parsed.exception &&
        typeof parsed.exception === "object" &&
        typeof parsed.exception.message === "string"
    ) {
        return parsed.exception.message;
    }

    return fallback;
};

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers = config.headers ?? {};
            config.headers.authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        const { setBgLoader, setErrorMessage, setShowLoader } = useUiStore.getState();

        setErrorMessage("");
        setShowLoader(false);
        setBgLoader(false);

        return response;
    },
    async (error: AxiosError) => {
        const { setBgLoader, setErrorMessage, setShowLoader } = useUiStore.getState();
        const { clearTokens, setTokens, refreshToken } = useAuthStore.getState();

        setBgLoader(false);
        setShowLoader(false);

        const originalConfig = (error.config ?? {}) as RetriableConfig;
        const status = error.response?.status;

        if (!status) {
            return Promise.reject(error);
        }

        if (status === 413) {
            toast.dismiss();
            notify("The picture is too large");
        }

        if (status === 400) {
            toast.dismiss();

            const message = resolveErrorMessage(error.response?.data);
            if (originalConfig.url?.includes("/api/v1/auth/login")) {
                setErrorMessage("");
            } else {
                notify(message);
                setErrorMessage(message);
            }
        }

        if (status === 401) {
            if (!refreshToken || originalConfig._retry) {
                clearTokens();
                setBgLoader(true);
                if (typeof window !== "undefined") {
                    window.location.pathname = "/";
                }
                setBgLoader(false);
                return Promise.reject(error);
            }

            try {
                originalConfig._retry = true;

                const { getRefreshToken, getUser } = await import("./requests");
                const refreshResponse = await getRefreshToken();
                const data = refreshResponse.data as TokenPair;
                setTokens(data.accessToken, data.refreshToken);

                void getUser().catch(() => {
                    // Best effort call to mirror the example behavior.
                });

                originalConfig.headers = originalConfig.headers ?? {};
                originalConfig.headers.authorization = `Bearer ${data.accessToken}`;

                return api(originalConfig);
            } catch (refreshError) {
                setBgLoader(true);
                clearTokens();
                if (typeof window !== "undefined") {
                    window.location.pathname = "/";
                }
                setBgLoader(false);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;