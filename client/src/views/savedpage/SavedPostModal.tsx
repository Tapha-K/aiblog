import React from "react";
import { type SavedPost } from "../../libs/types";
import Card from "../../components/Card";
import Button from "../../components/Button";
import SectionTitle from "../../components/SectionTitle";
import Typography from "../../components/Typography";

interface SavedPostModalProps {
    post: SavedPost | null;
    onClose: () => void;
}

const SavedPostModal: React.FC<SavedPostModalProps> = ({ post, onClose }) => {
    if (!post) return null;

    const { commit, aiSummary, savedAt } = post;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <Card
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-6">
                    <SectionTitle className="text-gray-900 dark:text-gray-900 break-all">
                        {commit.node.messageHeadline}
                    </SectionTitle>

                    <Typography
                        variant="meta"
                        className="text-gray-500 dark:text-gray-500"
                    >
                        By {commit.node.author.name} • Saved on{" "}
                        {new Date(savedAt).toLocaleString()} • Commit ID:{" "}
                        {commit.node.oid.slice(0, 7)}
                    </Typography>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="prose dark:prose-invert max-w-none">
                        <Typography
                            variant="body"
                            className="text-gray-900 dark:text-gray-900 leading-relaxed whitespace-pre-wrap"
                        >
                            {aiSummary}
                        </Typography>
                    </div>

                    <div className="flex justify-end">
                        <Button variant="primary" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SavedPostModal;
