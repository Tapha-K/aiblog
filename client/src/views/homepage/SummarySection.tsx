import React from "react";
import { type CommitNode } from "../../libs/types";
import SectionTitle from "../../components/SectionTitle";
import Card from "../../components/Card";
import Typography from "../../components/Typography";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/Button";

interface SummarySectionProps {
    selectedCommit: CommitNode | null;
    aiSummary: string;
    isAiLoading: boolean;
    onSavePost: () => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({
    selectedCommit,
    aiSummary,
    isAiLoading,
    onSavePost,
}) => {
    const isSaveDisabled = isAiLoading || !aiSummary;

    return (
        <section className="px-8 w-full">
            <SectionTitle>Selected Commit</SectionTitle>
            <Card>
                {!selectedCommit && (
                    <Typography variant="meta" className="text-center">
                        Select a commit to see details.
                    </Typography>
                )}
                {selectedCommit && (
                    <div className="space-y-6">
                        {/* 선택된 커밋 정보 */}
                        <div>
                            <Typography
                                as="h3"
                                variant="body"
                                className="font-semibold text-gray-900 truncate"
                            >
                                {selectedCommit.node.messageHeadline}
                            </Typography>
                            <Typography as="p" variant="meta" className="mt-1">
                                By {selectedCommit.node.author.name} on{" "}
                                {new Date(
                                    selectedCommit.node.committedDate
                                ).toLocaleDateString()}
                            </Typography>
                        </div>

                        <hr className="dark:border-gray-700" />

                        {/* AI 요약 섹션 */}
                        <div>
                            <Typography
                                as="h3"
                                variant="body"
                                className="font-semibold text-gray-900 mb-3 text-left"
                            >
                                AI Summary
                            </Typography>
                            {isAiLoading && (
                                <div className="flex justify-center items-center py-4">
                                    <LoadingSpinner
                                        theme="primary"
                                        size="base"
                                    />
                                </div>
                            )}
                            {!isAiLoading && aiSummary && (
                                <Typography
                                    variant="body"
                                    className="leading-relaxed"
                                >
                                    {aiSummary}
                                </Typography>
                            )}
                            {!isAiLoading && !aiSummary && (
                                <Typography
                                    variant="meta"
                                    className="text-center"
                                >
                                    Click 'Generate Summary' on a commit.
                                </Typography>
                            )}
                        </div>

                        {/* 저장 버튼 */}
                        <Button
                            variant="primary"
                            onClick={onSavePost}
                            disabled={isSaveDisabled}
                            className="w-full"
                        >
                            Save as Blog Post
                        </Button>
                    </div>
                )}
            </Card>
        </section>
    );
};

export default SummarySection;
