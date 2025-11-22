import React, { useState } from "react";

import RepoForm from "./RepoForm";
import CommitListSection from "./CommitListSection";
import SummarySection from "./SummarySection";
import PromptModal from "./PromptModal";
import AlertModal from "../../components/AlertModal";

import { type CommitNode } from "../../libs/types";
import { useSavedPosts } from "../contexts/SavedPostContext";
import { useGitHubCommits } from "../../libs/hooks/useGitHubCommits";
import { useAiSummary } from "../../libs/hooks/useAiSummary";

// 기본 프롬프트
const DEFAULT_PROMPT = `
You are a helpful programming assistant.
Summarize the following GitHub commit message concisely, focusing on the main action and purpose.
Respond in 1-2 sentences. Keep the summary technical but clear.
`.trim();

const HomePage: React.FC = () => {
    // 1. 커스텀 훅 사용
    const {
        owner,
        repo,
        setOwner,
        setRepo,
        commits,
        loading,
        error,
        fetchCommits,
    } = useGitHubCommits();

    const { aiSummary, isAiLoading, generateSummary, resetSummary } =
        useAiSummary();
    const { addPost } = useSavedPosts();

    const [selectedCommit, setSelectedCommit] = useState<CommitNode | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] =
        useState<boolean>(false);
    const [customPrompt, setCustomPrompt] = useState<string>(DEFAULT_PROMPT);

    // --- Handlers ---

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        resetSummary(); // 새 검색 시 요약 초기화
        setSelectedCommit(null);

        // 훅의 함수 호출
        await fetchCommits();
    };

    const handleGenerateSummary = async (commit: CommitNode) => {
        setSelectedCommit(commit);
        // 훅의 함수 호출
        await generateSummary(commit.node.messageHeadline, customPrompt);
    };

    const handleSelectCommit = (commit: CommitNode) => {
        setSelectedCommit(commit);
        resetSummary(); // 선택 변경 시 요약 초기화
    };

    const handleSavePost = () => {
        if (!selectedCommit || !aiSummary) return;

        const newPost = {
            id: selectedCommit.node.oid,
            commit: selectedCommit,
            aiSummary: aiSummary,
            savedAt: new Date().toISOString(),
        };

        addPost(newPost);
        setIsSuccessModalOpen(true);
    };

    const handleSavePrompt = (newPrompt: string) => {
        setCustomPrompt(newPrompt);
    };

    // --- Render ---
    return (
        <>
            <RepoForm
                owner={owner}
                repo={repo}
                loading={loading}
                onSubmit={handleSubmit}
                onOwnerChange={setOwner}
                onRepoChange={setRepo}
            />

            <div className="flex items-start divide-x justify-between py-8">
                <CommitListSection
                    loading={loading}
                    error={error}
                    commits={commits}
                    selectedCommit={selectedCommit}
                    onGenerateSummary={handleGenerateSummary}
                    onSelect={handleSelectCommit}
                    onOpenPromptModal={() => setIsModalOpen(true)}
                />

                <SummarySection
                    selectedCommit={selectedCommit}
                    aiSummary={aiSummary}
                    isAiLoading={isAiLoading}
                    onSavePost={handleSavePost}
                />
            </div>

            <PromptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePrompt}
                currentPrompt={customPrompt}
            />

            <AlertModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="저장 완료"
                message="블로그 글이 성공적으로 저장되었습니다! Saved Posts 메뉴에서 확인하실 수 있습니다."
            />
        </>
    );
};

export default HomePage;
