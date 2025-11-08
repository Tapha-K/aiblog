import React from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";

interface RepoFormProps {
    onSubmit: (event: React.FormEvent) => void;
    owner: string;
    repo: string;
    onOwnerChange: (value: string) => void;
    onRepoChange: (value: string) => void;
    loading: boolean;
}

const RepoForm: React.FC<RepoFormProps> = ({
    onSubmit,
    owner,
    repo,
    onOwnerChange,
    onRepoChange,
    loading,
}) => {
    return (
        <div className="border-b border-gray-400">
            <form onSubmit={onSubmit} className="mb-4 w-[800px] mx-auto">
                <div className="flex items-center justify-between gap-4 my-3">
                    <Input
                        label="GitHub Owner"
                        id="owner-input"
                        value={owner}
                        onChange={(e) => onOwnerChange(e.target.value)}
                        placeholder="Owner Name"
                        required
                    />
                    <Input
                        label="Repository Name"
                        id="repo-input"
                        value={repo}
                        onChange={(e) => onRepoChange(e.target.value)}
                        placeholder="Repository Name"
                        required
                    />
                    <div className="pt-7">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            size="base"
                            className=""
                        >
                            {loading ? <LoadingSpinner /> : "Fetch"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RepoForm;
