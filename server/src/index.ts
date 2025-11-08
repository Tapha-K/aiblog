import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST", "OPTIONS"], // 허용할 HTTP 메소드 명시
        allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더 명시
    })
);

app.use(express.json());

// 테스트용 API 엔드포인트
app.get("/api/test", (req: Request, res: Response) => {
    console.log("[/api/test] - React에서 요청이 왔습니다!");
    res.json({ message: "안녕하세요! Express 서버에서 보낸 응답입니다." });
});

// GitHub 프록시 엔드포인트
// client한테 받은 repository 주소를 받고 Github API로 데이터 요청
app.post("/api/github", async (req: Request, res: Response) => {
    const { owner, repo } = req.body;

    if (!owner || !repo) {
        return res
            .status(400)
            .json({ error: "owner와 repo 이름이 필요합니다." });
    }

    const graphqlQuery = {
        query: `
      query GetCommits($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef {
            name
            target {
              ... on Commit {
                history(first: 10) {
                  edges {
                    node {
                      messageHeadline
                      committedDate
                      author {
                        name
                        email
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
        variables: { owner, repo },
    };

    // 토큰 보관
    const token = process.env.GITHUB_TOKEN;
    const githubApiUrl = "https://api.github.com/graphql";

    console.log(`[Server] /api/github: ${owner}/${repo}의 데이터 요청 중...`);

    try {
        // Github API로 데이터 요청 (axios 사용)
        const response = await axios.post(
            githubApiUrl,
            graphqlQuery, // 객체 그대로 전달
            {
                headers: {
                    Authorization: `Bearer ${token}`, // .env의 토큰 사용
                    "Content-Type": "application/json",
                },
            }
        );

        // 7. Github한테 받은 데이터를 client로 전달
        console.log(
            "[Server] /api/github: GitHub로부터 응답 받음. Client로 전달."
        );
        res.status(200).json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                "[Server] /api/github: Axios 에러:",
                error.response?.data || error.message
            );
        } else {
            console.error("[Server] /api/github: GitHub API 요청 실패:", error);
        }

        res.status(500).json({
            error: "GitHub API 요청 중 오류가 발생했습니다.",
        });
    }
});

app.listen(port, () => {
    console.log(
        `[Server] Express 서버가 http://localhost:${port} 에서 실행 중입니다.`
    );
});
