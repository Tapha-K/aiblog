import React from "react";
import { type SavedPost } from "../../libs/types";
import Card from "../../components/Card";
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import { cn } from "../../libs/utils";

interface SavedPostItemProps {
    post: SavedPost;
    onDelete: (id: string) => void;
    onClick: () => void;
}

const SavedPostItem: React.FC<SavedPostItemProps> = ({
    post,
    onDelete,
    onClick,
}) => {
    const { id, commit, savedAt } = post;

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(id);
    };

    return (
        <Card
            onClick={onClick} // [추가] 카드 클릭 시 모달 열기
            className={cn(
                "mb-4 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-300"
            )}
        >
            <div className="flex justify-between items-start gap-4">
                {/* 내용 영역 */}
                <div className="flex-1 min-w-0">
                    {/* 커밋 제목 */}
                    <Typography
                        as="h3"
                        variant="body"
                        className="font-bold text-lg text-gray-900 dark:text-gray-900 truncate"
                    >
                        {commit.node.messageHeadline}
                    </Typography>

                    {/* 메타 정보 (작성자, 저장일) */}
                    <Typography
                        as="p"
                        variant="meta"
                        className="mt-1 text-sm text-gray-500 dark:text-gray-500"
                    >
                        By {commit.node.author.name} • Saved on{" "}
                        {new Date(savedAt).toLocaleDateString()}
                    </Typography>
                </div>

                {/* 삭제 버튼 */}
                <Button
                    variant="secondary" // 빨간색(secondary) 버튼 활용
                    size="small"
                    className="shrink-0"
                    onClick={handleDeleteClick}
                >
                    Delete
                </Button>
            </div>
        </Card>
    );
};

export default SavedPostItem;
