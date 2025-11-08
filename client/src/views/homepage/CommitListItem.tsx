import React from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import { type CommitNode } from "../../libs/types";
import { cn } from "../../libs/utils";

interface CommitListItemProps {
    commit: CommitNode;
    onGenerateSummary: (commit: CommitNode) => void;
    onSelect: (commit: CommitNode) => void;
    isSelected: boolean;
}

const CommitListItem: React.FC<CommitListItemProps> = ({
    commit,
    onGenerateSummary,
    onSelect,
    isSelected,
}) => {
    const { messageHeadline, author, committedDate } = commit.node;

    const handleGenerateClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation();
        onGenerateSummary(commit);
    };

    const handleCardClick = () => {
        onSelect(commit);
    };

    return (
        <Card
            onClick={handleCardClick}
            className={cn(
                "cursor-pointer transition-colors",
                isSelected
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "hover:bg-gray-100"
            )}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <Typography
                        as="h3"
                        variant="body"
                        className="font-semibold text-gray-900 truncate"
                    >
                        {messageHeadline}
                    </Typography>
                    <Typography as="p" variant="meta" className="mt-1 truncate">
                        By {author.name} on{" "}
                        {new Date(committedDate).toLocaleDateString()}
                    </Typography>
                </div>
                <Button
                    variant="primary"
                    size="small"
                    onClick={handleGenerateClick}
                    className="shrink-0"
                >
                    Summary
                </Button>
            </div>
        </Card>
    );
};

export default CommitListItem;
