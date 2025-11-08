export interface CommitNode {
    node: {
        messageHeadline: string;
        committedDate: string;
        author: {
            name: string;
            email: string;
        };
    };
}
