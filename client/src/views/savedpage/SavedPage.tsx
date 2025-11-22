import React, { useState } from "react";
import SectionTitle from "../../components/SectionTitle";
import Typography from "../../components/Typography";
import { useSavedPosts } from "../contexts/SavedPostContext";
import SavedPostItem from "./SavedPostItem";
import SavedPostModal from "./SavedPostModal";

const SavedPostsPage: React.FC = () => {
    const { posts, deletePost } = useSavedPosts();
    // [추가] 선택된 포스트 ID 상태 관리
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        if (confirm("정말 이 글을 삭제하시겠습니까?")) {
            deletePost(id);
            // 만약 보고 있던 글을 삭제했다면 모달 닫기
            if (selectedPostId === id) {
                setSelectedPostId(null);
            }
        }
    };

    // 선택된 포스트 객체 찾기
    const selectedPost =
        posts.find((post) => post.id === selectedPostId) || null;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <SectionTitle className="mb-6 text-2xl">
                My Saved Posts
            </SectionTitle>

            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <Typography variant="body" className="text-xl mb-2">
                        No saved posts yet.
                    </Typography>
                    <Typography variant="meta">
                        Go to the Home page and generate summaries to save them
                        here.
                    </Typography>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <SavedPostItem
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                            // [추가] 클릭 핸들러 전달
                            onClick={() => setSelectedPostId(post.id)}
                        />
                    ))}
                </div>
            )}

            {/* [추가] 모달 렌더링 */}
            <SavedPostModal
                post={selectedPost}
                onClose={() => setSelectedPostId(null)}
            />
        </div>
    );
};

export default SavedPostsPage;
