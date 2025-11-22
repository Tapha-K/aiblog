import React, { createContext, useContext, useReducer, useEffect } from "react";
import { type SavedPost } from "../../libs/types";

// 1. LocalStorage 키 이름
const STORAGE_KEY = "github-ai-blog-posts";

// 2. 상태(State)와 액션(Action) 타입 정의
interface SavedPostState {
    posts: SavedPost[];
}

type SavedPostAction =
    | { type: "ADD_POST"; payload: SavedPost }
    | { type: "DELETE_POST"; payload: string }; // payload는 삭제할 post id

// 3. 리듀서 (Reducer) 함수: 상태 변경 로직
const savedPostReducer = (
    state: SavedPostState,
    action: SavedPostAction
): SavedPostState => {
    switch (action.type) {
        case "ADD_POST":
            // 이미 존재하는지 확인 (중복 저장 방지)
            if (state.posts.some((post) => post.id === action.payload.id)) {
                return state;
            }
            return {
                ...state,
                posts: [action.payload, ...state.posts], // 최신 글을 맨 앞에 추가
            };
        case "DELETE_POST":
            return {
                ...state,
                posts: state.posts.filter((post) => post.id !== action.payload),
            };
        default:
            return state;
    }
};

// 4. Context 생성 (초기값은 null)
interface SavedPostContextType {
    posts: SavedPost[];
    addPost: (post: SavedPost) => void;
    deletePost: (id: string) => void;
}

const SavedPostContext = createContext<SavedPostContextType | null>(null);

// 5. Provider 컴포넌트
export const SavedPostProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // [초기화 로직] LocalStorage에서 데이터를 불러와서 초기 state로 설정
    const initializer = (): SavedPostState => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            return storedData
                ? { posts: JSON.parse(storedData) }
                : { posts: [] };
        } catch (error) {
            console.error("Failed to load from localStorage:", error);
            return { posts: [] };
        }
    };

    const [state, dispatch] = useReducer(
        savedPostReducer,
        { posts: [] },
        initializer
    );

    // [동기화 로직] state가 바뀔 때마다 LocalStorage에 저장
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.posts));
        } catch (error) {
            console.error("Failed to save to localStorage:", error);
        }
    }, [state.posts]);

    // 편의 함수 (Helper Functions)
    const addPost = (post: SavedPost) => {
        dispatch({ type: "ADD_POST", payload: post });
    };

    const deletePost = (id: string) => {
        dispatch({ type: "DELETE_POST", payload: id });
    };

    return (
        <SavedPostContext.Provider
            value={{ posts: state.posts, addPost, deletePost }}
        >
            {children}
        </SavedPostContext.Provider>
    );
};

// 6. 커스텀 훅 (Custom Hook) - 컴포넌트에서 쉽게 사용하기 위함
// eslint-disable-next-line react-refresh/only-export-components
export const useSavedPosts = () => {
    const context = useContext(SavedPostContext);
    if (!context) {
        throw new Error(
            "useSavedPosts must be used within a SavedPostProvider"
        );
    }
    return context;
};
