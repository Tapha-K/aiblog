import axios from "axios";
import { useGitHub } from "../../views/contexts/GitHubContext";
import { type GitHubApiResponse } from "../types";

const API_BASE_URL =
    import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL
        : "";

export const useGitHubCommits = () => {
    const { owner, repo, commits, loading, error, dispatch } = useGitHub();

    const setOwner = (newOwner: string) => {
        dispatch({
            type: "SET_INPUTS",
            payload: { owner: newOwner, repo: repo }, // 기존 repo 유지
        });
    };

    const setRepo = (newRepo: string) => {
        dispatch({
            type: "SET_INPUTS",
            payload: { owner: owner, repo: newRepo }, // 기존 owner 유지
        });
    };

    const fetchCommits = async () => {
        if (!owner || !repo) return;

        dispatch({ type: "FETCH_START" });

        try {
            const response = await axios.post<GitHubApiResponse>(
                `${API_BASE_URL}/api/github`,
                { owner, repo }
            );

            // [피드백 반영] throw 대신 setError로 처리하여 앱이 멈추지 않게 함
            if (response.data.errors) {
                // 에러 발생 시 dispatch
                dispatch({
                    type: "FETCH_ERROR",
                    payload: response.data.errors[0].message,
                });
                return;
            }

            const data =
                response.data?.data?.repository?.defaultBranchRef?.target
                    ?.history?.edges;

            if (data) {
                // 성공 시 데이터 저장 dispatch
                dispatch({ type: "FETCH_SUCCESS", payload: data });

                // 입력된 owner/repo 정보도 유지하고 싶다면:
                dispatch({ type: "SET_INPUTS", payload: { owner, repo } });
            } else {
                dispatch({
                    type: "FETCH_ERROR",
                    payload: "Repository not found or no commits.",
                });
            }
        } catch (err) {
            console.error(err);
            dispatch({
                type: "FETCH_ERROR",
                payload: "Failed to fetch data from server.",
            });
        }
    };

    return {
        owner,
        repo,
        setOwner,
        setRepo,
        commits,
        loading,
        error,
        fetchCommits,
    };
};
