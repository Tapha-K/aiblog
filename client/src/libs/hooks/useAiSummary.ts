import { useState } from "react";
import axios from "axios";

const API_BASE_URL =
    import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL
        : "";

export const useAiSummary = () => {
    const [aiSummary, setAiSummary] = useState<string>("");
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const generateSummary = async (
        commitMessage: string,
        customPrompt?: string
    ) => {
        setIsAiLoading(true);
        setAiSummary("");
        setAiError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/summarize`, {
                commitMessage,
                customPrompt,
            });

            setAiSummary(response.data.summary);
        } catch (err) {
            console.error("Failed to generate summary:", err);
            // [피드백 반영] 에러 상태를 별도로 관리하거나, 요약문에 에러 메시지를 담습니다.
            const errorMessage = "Error: Failed to generate summary.";
            setAiSummary(errorMessage);
            setAiError(errorMessage);
        } finally {
            setIsAiLoading(false);
        }
    };

    // 요약 초기화 함수
    const resetSummary = () => {
        setAiSummary("");
        setAiError(null);
        setIsAiLoading(false);
    };

    return { aiSummary, isAiLoading, aiError, generateSummary, resetSummary };
};
