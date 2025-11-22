import React, { createContext, useContext, useReducer } from "react";
import { type CommitNode } from "../../libs/types";

// 1. 상태(State) 타입 정의
interface GitHubState {
    owner: string;
    repo: string;
    commits: CommitNode[];
    loading: boolean;
    error: string | null;
}

// 2. 액션(Action) 타입 정의
type GitHubAction =
    | { type: "SET_INPUTS"; payload: { owner: string; repo: string } }
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; payload: CommitNode[] }
    | { type: "FETCH_ERROR"; payload: string }
    | { type: "RESET" };

// 3. 초기 상태
const initialState: GitHubState = {
    owner: "",
    repo: "",
    commits: [],
    loading: false,
    error: null,
};

// 4. 리듀서 함수
const githubReducer = (
    state: GitHubState,
    action: GitHubAction
): GitHubState => {
    switch (action.type) {
        case "SET_INPUTS":
            return {
                ...state,
                owner: action.payload.owner,
                repo: action.payload.repo,
            };
        case "FETCH_START":
            return { ...state, loading: true, error: null };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, commits: action.payload };
        case "FETCH_ERROR":
            return { ...state, loading: false, error: action.payload };
        case "RESET":
            return initialState;
        default:
            return state;
    }
};

// 5. Context 생성
interface GitHubContextType extends GitHubState {
    dispatch: React.Dispatch<GitHubAction>;
}

const GitHubContext = createContext<GitHubContextType | null>(null);

// 6. Provider 생성
export const GitHubProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(githubReducer, initialState);

    return (
        <GitHubContext.Provider value={{ ...state, dispatch }}>
            {children}
        </GitHubContext.Provider>
    );
};

// 7. 커스텀 훅
// eslint-disable-next-line react-refresh/only-export-components
export const useGitHub = () => {
    const context = useContext(GitHubContext);
    if (!context) {
        throw new Error("useGitHub must be used within a GitHubProvider");
    }
    return context;
};
