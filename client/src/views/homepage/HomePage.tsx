import { useState } from "react";
import axios from "axios";

import RepoForm from "./RepoForm";
import CommitListSection from "./CommitListSection";
import SummarySection from "./SummarySection";
import { type CommitNode } from "../../libs/types";

const HomePage: React.FC = () => {
    const [owner, setOwner] = useState<string>("");
    const [repo, setRepo] = useState<string>("");
    const [commits, setCommits] = useState<CommitNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedCommit, setSelectedCommit] = useState<CommitNode | null>(
        null
    );
    const [aiSummary, setAiSummary] = useState<string>("");
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setCommits([]);
        setSelectedCommit(null);
        setAiSummary("");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/github",
                { owner, repo }
            );
            const data =
                response.data?.data?.repository?.defaultBranchRef?.target
                    ?.history?.edges;

            if (data) {
                setCommits(data);
                if (data.length > 0) {
                    setSelectedCommit(data[0]);
                }
            } else {
                setError("Repository not found or no commits.");
            }
        } catch (err) {
            setError("Failed to fetch data from server.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSummary = async (commit: CommitNode) => {
        setSelectedCommit(commit); // 요약할 커밋을 선택
        setIsAiLoading(true);
        setAiSummary("");

        try {
            // 1. 백엔드 서버의 /api/summarize로 커밋 메시지를 보냄
            const response = await axios.post(
                "http://localhost:8000/api/summarize",
                {
                    commitMessage: commit.node.messageHeadline, // 요약할 텍스트
                }
            );

            // 2. 백엔드로부터 받은 요약 텍스트를 state에 저장
            setAiSummary(response.data.summary);
        } catch (err) {
            console.error("Failed to generate summary:", err);
            setAiSummary("Error: Failed to generate summary.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSavePost = () => {
        alert("Blog post saved!");
    };

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
                    onSelect={setSelectedCommit}
                />

                <SummarySection
                    selectedCommit={selectedCommit}
                    aiSummary={aiSummary}
                    isAiLoading={isAiLoading}
                    onSavePost={handleSavePost}
                />
            </div>
        </>
    );
};

export default HomePage;
