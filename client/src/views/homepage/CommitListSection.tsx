import React from "react";
import { type CommitNode } from "../../libs/types";
import SectionTitle from "../../components/SectionTitle";
import LoadingSpinner from "../../components/LoadingSpinner";
import Typography from "../../components/Typography";
import CommitListItem from "./CommitListItem";

interface CommitListSectionProps {
    loading: boolean;
    error: string | null;
    commits: CommitNode[];
    selectedCommit: CommitNode | null;
    onGenerateSummary: (commit: CommitNode) => void;
    onSelect: (commit: CommitNode) => void;
}

const CommitListSection: React.FC<CommitListSectionProps> = ({
    loading,
    error,
    commits,
    selectedCommit,
    onGenerateSummary,
    onSelect,
}) => {
    return (
        <section className="px-8 w-[600px] flex-shrink-0">
            <SectionTitle>Recent Commits</SectionTitle>
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner theme="primary" size="large" />
                </div>
            )}
            {error && (
                <Typography variant="body" className="text-red-500 text-center">
                    Error: {error}
                </Typography>
            )}
            {!loading && !error && commits.length === 0 && (
                <Typography variant="meta" className="text-center">
                    No commits found. Fetch a repository to start.
                </Typography>
            )}
            <div className="space-y-4">
                {commits.map((commit, index) => (
                    <CommitListItem
                        key={index}
                        commit={commit}
                        onGenerateSummary={onGenerateSummary}
                        onSelect={onSelect}
                        isSelected={selectedCommit === commit}
                    />
                ))}
            </div>
        </section>
    );
};

export default CommitListSection;
